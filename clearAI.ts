import * as shell from 'shelljs';

shell.exec('npm remove langchain openai');
shell.rm('-rf', 'src/api/chat');
shell.rm('-rf', 'src/application/chat');
shell.rm('-rf', 'test/application/chat');
