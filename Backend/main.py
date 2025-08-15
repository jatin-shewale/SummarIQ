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

# Initialize variables
agent_executor = None
parser = None

# Get API key
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    try:
        # Create LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.4,
            google_api_key=api_key
        )
        
        # Create parser
        parser = PydanticOutputParser(pydantic_object=BookSummary)
        
        # Create prompt
        def escape_curly_braces(text):
            return text.replace("{", "{{").replace("}", "}}")
        
        format_instructions = escape_curly_braces(parser.get_format_instructions())
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("placeholder", "{chat_history}"),
            ("human", "{query}"),
            ("placeholder", "{agent_scratchpad}"),
        ]).partial(format_instructions=format_instructions)
        
        # Create agent
        agent = create_tool_calling_agent(
            llm=llm,
            tools=tools,
            prompt=prompt
        )
        
        # Create agent executor
        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True
        )
        
        print("AI components initialized successfully")
        
    except Exception as e:
        print(f"Error initializing AI components: {e}")
        agent_executor = None
        parser = None
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables")
    print("Please create a .env file with your Google Gemini API key")
    print("Example: GOOGLE_API_KEY=your_api_key_here") 