import { chromium, Browser, Page } from 'playwright';

export interface InvestmentPortalConfig {
  urls: {
    login: string;
    target: string;
  };
  selectors: {
    portfolioContainer: string;
    pageTitle: string;
    tokenButton: string;
  };
  timeouts: {
    navigation: number;
    loginConfirmation: number;
    elementVisibility: number;
  };
  filters: {
    types: {
      multi: {
        options: string;
        checkbox: string;
      };
    };
    labels: Record<string, {
      type: string;
      selector: string;
      button?: string;
    }>;
  };
  table: {
    selector: string;
    columns: Record<string, {
      index: number;
      subSelector?: string;
      attr?: string;
      join?: string;
    }>;
  };
}

export class InvestmentPortalNavigator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private availableBalance: number = 0;
  private config: InvestmentPortalConfig;
  private logger: (message: string) => void;

  constructor(config: InvestmentPortalConfig, logger: (message: string) => void = console.log) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Inicializa o navegador e configura o contexto
   */
  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized'
      ]
    });

    const context = await this.browser.newContext({
      viewport: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
    });
    
    this.page = await context.newPage();
    this.log('Navegador inicializado');
  }

  /**
   * Navega para a página de login
   */
  async navigateToLogin(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    this.log('Navegando para página de login...');
    await this.page.goto(this.config.urls.login, {
      waitUntil: 'domcontentloaded',
      timeout: this.config.timeouts.navigation
    });
  }

  /**
   * Aguarda conclusão manual do login pelo usuário
   */
  async waitForManualLogin(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    this.log('Aguardando login manual...');
    await Promise.race([
      this.page.waitForURL(/\/meu-portfolio|\/home/, {
        timeout: this.config.timeouts.loginConfirmation
      }),
      this.page.waitForSelector(this.config.selectors.portfolioContainer, {
        timeout: this.config.timeouts.loginConfirmation
      })
    ]);
    this.log('Login confirmado');
  }

  /**
   * Navega para a página principal de investimentos
   */
  async navigateToTargetPage(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    this.log(`Navegando diretamente para ${this.config.urls.target}`);
    await this.page.goto(this.config.urls.target, {
      waitUntil: 'domcontentloaded',
      timeout: this.config.timeouts.navigation
    });

    await this.page.waitForSelector(this.config.selectors.pageTitle, {
      state: 'attached',
      timeout: this.config.timeouts.elementVisibility * 2
    });

    await this.captureAvailableBalance();
  }

  /**
   * Captura o saldo disponível da conta
   */
  private async captureAvailableBalance(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    try {
      const balanceSelector = '#main > div > div > div > div > summary-header > header > div > div > div > div:nth-child(1) strong';

      await this.page.waitForSelector(balanceSelector, {
        state: 'visible',
        timeout: 30000
      });

      const valueText = await this.page.textContent(balanceSelector);
      if (valueText) {
        this.availableBalance = this.parseCurrency(valueText);
        this.log(`Saldo capturado: ${this.formatCurrency(this.availableBalance)}`);
      }
    } catch (error) {
      throw new Error(`Falha ao capturar saldo: ${error}`);
    }
  }

  /**
   * Encerra a sessão do navegador
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.log('Navegador fechado');
    }
  }

  /**
   * Executa o fluxo completo de automação
   */
  async run(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      await this.initialize();
      await this.navigateToLogin();
      await this.waitForManualLogin();
      await this.navigateToTargetPage();
      
      // Aqui seria implementada a lógica completa de interação com filtros,
      // extração de dados e aplicação em investimentos
      
      return { 
        success: true, 
        message: 'Automação concluída com sucesso',
        data: {
          balance: this.availableBalance
        }
      };
    } catch (error: any) {
      this.log(`ERRO: ${error.message}`);
      return { 
        success: false, 
        message: `Falha na automação: ${error.message}` 
      };
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Converte valores monetários (ex: 'R$ 1.234,56' para 1234.56)
   */
  private parseCurrency(value: string): number {
    try {
      // Capturar padrões como "R$ 1.234,56" ou "1.234,56"
      const match = value.match(/(\d[\d.,]*)/);
      if (!match) throw new Error('Padrão numérico não encontrado');

      const cleaned = match[0]
          .replace(/\./g, '')
          .replace(',', '.');

      return parseFloat(cleaned);
    } catch (error) {
      throw new Error(`Valor inválido: '${value}' - ${error}`);
    }
  }

  /**
   * Formata valores monetários
   */
  private formatCurrency(value: number, includeSymbol = true): string {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    return includeSymbol ? `R$ ${formatted}` : formatted.replace('.', ',');
  }

  /**
   * Logger com timestamp
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logger(`[${timestamp}] ${message}`);
  }
}

// Configuração padrão baseada no arquivo de exemplo
export const DEFAULT_CONFIG: InvestmentPortalConfig = {
  urls: {
    login: 'https://portal.btgpactual.com/digital/#!/entrar/login',
    target: 'https://portal.btgpactual.com/digital/#!/aplicar/renda-fixa/cdb-lca-lci-lf'
  },
  selectors: {
    portfolioContainer: '.portfolio-container',
    pageTitle: 'h2.section-title',
    tokenButton: '#main > div > div > div > div > div.ng-animate-enabled > investments-modal > div > div.ng-modal-dialog.uiAnimate-fadeDownToUp.has-button-toolbar.ng-animate-enabled > div.ng-modal-dialog-content.clearfix > div:nth-child(2) > div.flowContainer > div > div > div:nth-child(2) > form > div > div > uplevel-input > div > div.field.noMarginBottom.noMarginTop > input'
  },
  timeouts: {
    navigation: 90000,
    loginConfirmation: 180000,
    elementVisibility: 45000
  },
  filters: {
    types: {
      multi: {
        options: 'ul > li:not(:has(input[ng-model="allSelected"]))',
        checkbox: 'input[type="checkbox"]'
      }
    },
    labels: {
      'Produto': {
        type: 'multi',
        selector: 'div[element="_A"]',
        button: 'button:has-text("Todos(as)")'
      },
      'Indexador': {
        type: 'multi',
        selector: 'div[element="_B"]',
        button: 'button:has-text("Todos(as)")'
      },
      'Emissor': {
        type: 'multi',
        selector: 'div[element="_C"]',
        button: 'button:has-text("Todos(as)")'
      },
      'Risco': {
        type: 'multi',
        selector: 'div[element="_D"]',
        button: 'button:has-text("Todos(as)")'
      },
      'Liquidez': {
        type: 'multi',
        selector: 'div[element="_E"]',
        button: 'button:has-text("Todos(as)")'
      },
      'Prazo': {
        type: 'select',
        selector: '#termination'
      },
      'Aplicação Mínima': {
        type: 'select',
        selector: '#aplicacao_minima'
      }
    }
  },
  table: {
    selector: 'table.moneyValues.enhanced.mobileVersion tbody tr',
    columns: {
      Risco: {
        index: 0,
        subSelector: 'span.riskLevelSymbol',
        attr: 'class'
      },
      Produto: {
        index: 0,
        subSelector: 'div.textUppercase, small.textDescOverflow',
        join: ' - '
      },
      Prazo: { index: 1 },
      Vencimento: { index: 2 },
      Taxa: {
        index: 3,
        subSelector: 'span',
        join: ' '
      },
      'Taxa Eq. CDB': {
        index: 4,
        subSelector: 'span'
      },
      Juros: { index: 5 },
      'Lastro disponível': { index: 6 },
      'Aplicação Mínima': { index: 7 }
    }
  }
};
