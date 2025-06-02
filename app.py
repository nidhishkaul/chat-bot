from flask import Flask, request, jsonify, render_template
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)

template = """
Answer the question below

Here is the conversation history:{context}

Question: {question}

Answer:
"""

model = OllamaLLM(model="llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

conversation_history = ""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    global conversation_history
    user_input = request.json["message"]
    
    result = chain.invoke({
        "context": conversation_history,
        "question": user_input
    })
    
    answer = result.content if hasattr(result, "content") else str(result)
    conversation_history += f"\nUser: {user_input}\nChatBot: {answer}"

    return jsonify({"reply": answer})

if __name__ == "__main__":
    app.run(debug=True)
