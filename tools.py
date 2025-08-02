import os, datetime
from langchain.tools import Tool

def save_summary(text: str, title: str = "summary"):
    """
    Save the summary to a file with the current date and time in the filename.
    """
    os.makedirs("summaries", exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"summaries/{title}_{timestamp}.txt"
    with open(filename, "w", encoding = "utf-8") as file:
        file.write(text.strip())
    return f"Saved summary to {filename}"

tools = [
    Tool(
        name="save_summary",
        func=save_summary,
        description="Saves a summary to a file with the current date and time in the filename."
    )
]