declare global {
  namespace App {
    interface Platform {
      env: {
        BIOLINK_DB?: D1Database;
        PUBLIC_SITE_URL?: string;
        PUBLIC_SITE_NAME?: string;
        ADMIN_EMAIL?: string;
        ADMIN_PASSWORD?: string;
        ADMIN_SESSION_SECRET?: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      cf?: IncomingRequestCfProperties;
    }
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    all<T = unknown>(): Promise<D1Result<T>>;
    run<T = unknown>(): Promise<D1Result<T>>;
  }

  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    meta: Record<string, unknown>;
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }
}

export {};
