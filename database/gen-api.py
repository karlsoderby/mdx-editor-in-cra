import os
from openai import OpenAI

def get_openai_client():
    """
    Initialize and return the OpenAI client.
    """
    return OpenAI(api_key="api-key")

def read_cpp_file(file_path):
    """
    Read content from a C++ file.
    """
    try:
        with open(file_path, "r") as cpp_file:
            return cpp_file.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def call_openai_to_generate_api_docs(client, cpp_content):
    """
    Send C++ content to OpenAI API and get API documentation in Markdown.
    """
    prompt = f"""
    Generate detailed API documentation in Markdown format for the following C++ code:
    {cpp_content}
    """
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-4o",  # Use the latest optimized GPT-4 model
        )
        # Access the response correctly
        markdown_content = response.choices[0].message.content
        return markdown_content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

def save_to_markdown(data, output_path):
    """
    Save API documentation to a Markdown file.
    """
    with open(output_path, "w") as markdown_file:
        markdown_file.write(data)
    print(f"Markdown saved to {output_path}")

def process_cpp_files_in_folder(folder_path, output_folder):
    """
    Process all C++ files in a folder and generate API documentation in Markdown.
    """
    client = get_openai_client()  # Initialize OpenAI client once
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".cpp") or file_name.endswith(".h"):
            cpp_path = os.path.join(folder_path, file_name)
            print(f"Processing {cpp_path}...")
            
            # Step 1: Read content from the C++ file
            cpp_content = read_cpp_file(cpp_path)
            if cpp_content is None:
                print(f"Skipping {file_name} due to file read error.")
                continue
            
            # Step 2: Send content to OpenAI
            markdown_data = call_openai_to_generate_api_docs(client, cpp_content)
            if markdown_data is None:
                print(f"Skipping {file_name} due to OpenAI API error.")
                continue
            
            # Step 3: Save Markdown output
            markdown_file_name = os.path.splitext(file_name)[0] + ".md"
            markdown_output_path = os.path.join(output_folder, markdown_file_name)
            save_to_markdown(markdown_data, markdown_output_path)

if __name__ == "__main__":
    # Input folder containing C++ files
    input_folder = "path_to_cpp_files"
    # Output folder for Markdown files
    output_folder = "path_to_output_docs"

    process_cpp_files_in_folder(input_folder, output_folder)