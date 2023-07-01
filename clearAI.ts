import * as shell from 'shelljs';

shell.exec('npm remove hnswlib-node langchain multer openai @types/multer');
shell.rm('-rf', 'src/api/llm');
shell.rm('-rf', 'src/application/llm');
shell.rm('-rf', 'src/infra/llm');
shell.rm('-rf', 'test/api/llm');
shell.rm('-rf', 'test/application/llm');
