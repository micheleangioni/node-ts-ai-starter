import * as shell from 'shelljs';

shell.mkdir('-p', 'build/infra/resources/');
shell.cp('-R', 'src/infra/resources', 'build/infra/resources/');
