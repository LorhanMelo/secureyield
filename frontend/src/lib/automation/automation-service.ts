import { InvestmentPortalNavigator, DEFAULT_CONFIG } from './investment-portal';

export interface AutomationOptions {
  userId: string;
  parameters?: Record<string, any>;
  onLog?: (message: string) => void;
}

export class AutomationService {
  private logs: string[] = [];

  constructor() {}

  private log(message: string): void {
    const logMessage = `[${new Date().toISOString()}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public async runAutomation(options: AutomationOptions): Promise<{
    success: boolean;
    message: string;
    data?: any;
    logs: string[];
  }> {
    this.logs = [];
    const logger = options.onLog || this.log.bind(this);

    try {
      logger('Iniciando automação de investimento');
      
      // Criar instância do navegador com a configuração padrão
      const navigator = new InvestmentPortalNavigator(DEFAULT_CONFIG, logger);
      
      // Executar a automação
      const result = await navigator.run();
      
      logger(`Automação finalizada: ${result.success ? 'Sucesso' : 'Falha'}`);
      
      return {
        ...result,
        logs: this.getLogs()
      };
    } catch (error: any) {
      logger(`Erro fatal na automação: ${error.message}`);
      return {
        success: false,
        message: `Erro fatal na automação: ${error.message}`,
        logs: this.getLogs()
      };
    }
  }
}
