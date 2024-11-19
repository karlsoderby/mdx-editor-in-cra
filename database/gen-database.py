import os
import yaml
from openai import OpenAI
from PyPDF2 import PdfReader

def get_openai_client():
    """
    Initialize and return the OpenAI client.
    """
    return OpenAI(api_key="api-key")

def extract_content_from_pdf(pdf_path):
    """
    Extract content from a PDF file.
    """
    content = []
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            content.append(page.extract_text())
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    return "\n".join(content)

def call_openai_to_generate_yaml(client, content):
    """
    Send extracted content to OpenAI API and get structured YAML response.
    """
    prompt = f"""
    Extract structured hardware data from the following content and format it as YAML:
    {content}
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
        yaml_content = response.choices[0].message.content
        return yaml_content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

def save_to_yaml(data, output_path):
    """
    Save structured data to a YAML file.
    """
    with open(output_path, "w") as yaml_file:
        yaml_file.write(data)  # Already formatted as YAML by OpenAI
    print(f"YAML saved to {output_path}")

def process_pdfs_in_folder(folder_path, output_folder):
    """
    Process all PDF files in a folder and convert to YAML.
    """
    client = get_openai_client()  # Initialize OpenAI client once
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, file_name)
            print(f"Processing {pdf_path}...")
            
            # Step 1: Extract content from PDF
            content = extract_content_from_pdf(pdf_path)
            
            # Step 2: Send content to OpenAI
            yaml_data = call_openai_to_generate_yaml(client, content)
            if yaml_data is None:
                print(f"Skipping {file_name} due to OpenAI API error.")
                continue
            
            # Step 3: Save YAML output
            yaml_file_name = os.path.splitext(file_name)[0] + ".yaml"
            yaml_output_path = os.path.join(output_folder, yaml_file_name)
            save_to_yaml(yaml_data, yaml_output_path)

if __name__ == "__main__":
    # Input folder containing PDFs
    input_folder = "input"
    # Output folder for YAML files
    output_folder = "output"

    process_pdfs_in_folder(input_folder, output_folder)