import express from 'express';

export abstract class RoutesConfig {
  expressApp: express.Application;

  name: string;

  constructor(expressApp: express.Application, name: string) {
    this.expressApp = expressApp;
    this.name = name;
    this.configureRoutes();
  }

  getName() {
    return this.name;
  }

	abstract configureRoutes(): express.Application;
}
