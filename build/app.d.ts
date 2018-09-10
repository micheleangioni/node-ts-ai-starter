import express from 'express';
export default function (app: express.Application): Promise<{
    app: express.Application;
    logger: Console;
}>;
