from dotenv import load_dotenv; load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.messages import HumanMessage, AIMessage
from tools import tools
from schema import BookSummary
from prompts import SYSTEM_PROMPT
import os


# Initialize the Google Generative AI model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.4,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# print("API Key loaded?", os.getenv("GOOGLE_API_KEY") is not None)
parser = PydanticOutputParser(pydantic_object=BookSummary)

# Create a prompt template for the agent
def escape_curly_braces(text):
    return text.replace("{", "{{").replace("}", "}}")

format_instructions = escape_curly_braces(parser.get_format_instructions())

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("placeholder", "{chat_history}"),
    ("human", "{query}"),
    ("placeholder", "{agent_scratchpad}"),
]).partial(format_instructions=format_instructions)


# Create the tool-calling agent
agent = create_tool_calling_agent(
    llm=llm,
    tools=tools,
    prompt=prompt
)

# Create the agent executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True
)

chat_history = []
print("Welcome to the SummarIQ!")
print("Paste a chapter or section below, and the SummarIQ will summarize it for you.")

while True:
    text = input("Enter text to summarize (or 'exit' to quit): ")
    if text.lower() == 'exit':
        print("Exiting SummarIQ. Goodbye!")
        break

    chat_history.append(HumanMessage(content=text))
    response = agent_executor.invoke({
        "query": text,
        "chat_history": chat_history
    })

    try:
        result = parser.parse(response['output'])
        print(f"Title: {result.title}\n Summary: {result.summary}\nSaved at: {result.saved_path}")
        chat_history.append(AIMessage(content = result.summary))
    except Exception as e:
        print(f"Error parsing response: {e}")
        print("Response:", response['output'])
        chat_history.append(AIMessage(content="An error occurred while processing your request. Please try again."))