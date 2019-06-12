const config = {
  MONGO: {
    development: {
      adapter: process.env.MONGO_DB_ADAPTER,
      database: process.env.MONGO_DB_DATABASE,
      username: process.env.MONGO_DB_USERNAME,
      password: process.env.MONGO_DB_PASSWORD,
      host: process.env.MONGO_DB_HOST,
      port: process.env.MONGO_DB_PORT
    },
    test: {
      adapter: process.env.MONGO_DB_ADAPTER,
      database: process.env.MONGO_TEST_DB_DATABASE,
      username: process.env.MONGO_DB_USERNAME,
      password: process.env.MONGO_DB_PASSWORD,
      host: process.env.MONGO_DB_HOST,
      port: process.env.MONGO_DB_PORT
    },
    staging: {
      adapter: process.env.MONGO_DB_ADAPTER,
      database: process.env.MONGO_STAGING_DB_DATABASE,
      username: process.env.MONGO_DB_USERNAME,
      password: process.env.MONGO_DB_PASSWORD,
      host: process.env.MONGO_DB_HOST,
      port: process.env.MONGO_DB_PORT
    },
    production: {
      adapter: process.env.MONGO_DB_ADAPTER,
      database: process.env.MONGO_DB_DATABASE,
      username: process.env.MONGO_DB_USERNAME,
      password: process.env.MONGO_DB_PASSWORD,
      host: process.env.MONGO_DB_HOST,
      port: process.env.MONGO_DB_PORT
    }
  },
  PG: {
    development: {
      adapter: process.env.PG_DB_ADAPTER,
      database: process.env.PG_DB_DATABASE,
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT
    },
    test: {
      adapter: process.env.PG_DB_ADAPTER,
      database: process.env.PG_TEST_DB_DATABASE,
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT
    },
    staging: {
      adapter: process.env.PG_DB_ADAPTER,
      database: process.env.PG_STAGING_DB_DATABASE,
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT
    },
    production: {
      adapter: process.env.PG_DB_ADAPTER,
      database: process.env.PG_DB_DATABASE,
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      host: process.env.PG_DB_HOST,
      port: process.env.PG_DB_PORT
    }
  }
}

module.exports = (adapter, env) => { return config[adapter][env] }
