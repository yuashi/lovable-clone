from dotenv import load_dotenv
load_dotenv()

from langchain_groq import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langchain.agents import create_agent

from prompts import *
from states import *
from tools import *

llm=ChatGroq(model="openai/gpt-oss-120b", )


def planner_agent(state:dict)->dict:
    user_prompt=state["user_prompt"]
    res=llm.with_structured_output(Plan).invoke(planner_prompt(user_prompt))
    return {"plan":res}

def architect_agent(state:dict)->dict:
    plan=state["plan"]
    res=llm.with_structured_output(TaskPlan).invoke(architect_prompt(plan))
    if res is None:
        raise ValueError("Architect agent did not generate any response.")
    res.plan=plan
    return {"task_plan":res}

def coder_agent(state:dict)->dict:
    coder_state=state.get("coder_state")
    if coder_state is None:
        coder_state=CoderState(task_plan=state['task_plan'],current_step_idx=0)

    steps=coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx>=len(steps):
        return {"coder_state": coder_state, "status": "DONE"}
    
    current_task=steps[coder_state.current_step_idx]
    existing_content=read_file.run(current_task.filepath)
    user_prompt=(
        f"Task:{current_task.task_description}\n"
        f"Filepath:{current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )
    system_prompt=coder_system_prompt()
    coder_tools=[read_file, write_file, list_files, get_current_directory]
    react_agent=create_agent(llm, coder_tools)
    react_agent.invoke({"messages":[{"role":"system","content":system_prompt},{"role":"user","content":user_prompt}]})

    coder_state.current_step_idx+=1

    return {"coder_state":coder_state}


graph=StateGraph(dict)
graph.add_node("planner",planner_agent)
graph.add_node("architect",architect_agent)
graph.add_node("coder",coder_agent)
graph.add_edge(start_key="planner", end_key="architect")
graph.add_edge(start_key="architect", end_key="coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END": END, "coder": "coder"}
)

graph.set_entry_point("planner")

agent=graph.compile()



if __name__=="__main__":
    user_prompt="create a simple calculator web application"
    result=agent.invoke(input={"user_prompt":user_prompt},config={"recursion_limit":100})
    print(result)