import { join } from 'path';
import type { Config } from '../types/index.js';
import fs from 'fs/promises';
import Handlebars from 'handlebars';

export class TemplatesService {
    private config!: Config;
    private templatesDir!: string;
    private cache!: Map<string, HandlebarsTemplateDelegate>;

    constructor({ config }: { config: Config }) {
        this.config = config;
        this.templatesDir = join(this.config.projectRoot, 'templates');
        this.cache = new Map<string, HandlebarsTemplateDelegate>();
    }

    async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
        if (this.cache.has(templateName)) {
            return this.cache.get(templateName)!;
        }
        const templatePath = join(this.templatesDir, templateName);
        const template = await fs.readFile(templatePath, 'utf-8');
        const compiledTemplate = Handlebars.compile(template);
        this.cache.set(templateName, compiledTemplate);
        return compiledTemplate;
    }

    async renderTemplate(templateName: string, data: Record<string, unknown>): Promise<string> {
        const template = await this.loadTemplate(templateName);
        return template(data);
    }
  }