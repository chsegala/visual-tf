import type { Express, Response } from 'express';
import { Router, json } from 'express';
import { diffString } from 'json-diff';
import { logger } from 'shared';
import { terraformService } from '../../service/terraform';

interface Args {
    cwd: string;
}

export const router = ({ cwd }: Args): Router => {
    const r = Router();
    const service = terraformService({ cwd });

    r.get('/plan', (_, res) => {
        if (!service.hasPlan()) {
            res.sendStatus(404);
            logger.warn('unable to find a valid plan');
            return;
        }

        res.json(service.getPlan());
    })

    r.put('/plan', (_req, res, next) => {
        res.status(202)
            .json({
                _href: 'plan'
            });

        service.plan()
            .then(() => next())
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            .catch(() => logger.error('unable to process plan'));
    });

    interface TypedRequest<T, U> extends Express.Request {
        body: U,
        query: T
    }

    interface DiffBody {
        before?: object;
        after?: object;
    }

    r.use(json())
        .put('/diff', (req: TypedRequest<never, DiffBody>, res: Response) => {
            const data = req.body;
            res.send(diffString(data.before || {}, data.after));
        });

    return r;
}