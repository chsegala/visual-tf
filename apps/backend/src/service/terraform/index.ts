import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { logger } from 'shared';

interface Args {
    cwd: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createInstance = ({ cwd }: Args) => {
    const tempDir = join(tmpdir(), "visual-tf");
    const planFile = join(tempDir, 'plan.bin')

    mkdirSync(tempDir, { recursive: true });

    function hasPlan(): boolean {
        return existsSync(planFile);
    }

    function getPlan(): object {
        if (!hasPlan()) {
            throw new Error('file not found');
        }
        const fileContent = execSync(`terraform show -json ${planFile}`, { cwd, encoding: 'utf8' });
        return JSON.parse(fileContent) as object;
    }

    async function plan(): Promise<void> {
        const p = spawn('bash', ['-c', `terraform plan -out ${planFile}`], { cwd });
        p.stdout.on('data', (data: Buffer): void => { logger.info(data.toString().trim()) });
        p.stderr.on('data', (data: Buffer): void => { logger.error(data.toString().trim()) });

        return Promise.resolve();
    }

    return {
        hasPlan,
        getPlan,
        plan
    }
};

type Ret = ReturnType<typeof createInstance>
const instances = new Map<string, Ret>();

export const terraformService = ({ cwd }: Args): Ret => {
    if (!instances.get(cwd)) {
        instances.set(cwd, createInstance({ cwd }));
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return instances.get(cwd)!;
}