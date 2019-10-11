const config = {
  MONGO: {
    default: {
      admin_username: process.env.MONGO_DEFAULT_DB_ADMIN_USERNAME,
      admin_password: process.env.MONGO_DEFAULT_DB_ADMIN_PASSWORD,
      username: process.env.MONGO_DEFAULT_DB_USERNAME,
      password: process.env.MONGO_DEFAULT_DB_PASSWORD,
      host: process.env.MONGO_DEFAULT_DB_HOST,
      port: process.env.MONGO_DEFAULT_DB_PORT
    },
    development: {
      admin_username: process.env.MONGO_DEVELOPMENT_DB_ADMIN_USERNAME,
      admin_password: process.env.MONGO_DEVELOPMENT_DB_ADMIN_PASSWORD,
      adapter: process.env.MONGO_DEVELOPMENT_DB_ADAPTER,
      database: process.env.MONGO_DEVELOPMENT_DB_DATABASE,
      username: process.env.MONGO_DEVELOPMENT_DB_USERNAME,
      password: process.env.MONGO_DEVELOPMENT_DB_PASSWORD,
      host: process.env.MONGO_DEVELOPMENT_DB_HOST,
      port: process.env.MONGO_DEVELOPMENT_DB_PORT
    },
    test: {
      admin_username: process.env.MONGO_TEST_DB_ADMIN_USERNAME,
      admin_password: process.env.MONGO_TEST_DB_ADMIN_PASSWORD,
      adapter: process.env.MONGO_TEST_DB_ADAPTER,
      database: process.env.MONGO_TEST_DB_DATABASE,
      username: process.env.MONGO_TEST_DB_USERNAME,
      password: process.env.MONGO_TEST_DB_PASSWORD,
      host: process.env.MONGO_TEST_DB_HOST,
      port: process.env.MONGO_TEST_DB_PORT
    },
    staging: {
      admin_username: process.env.MONGO_STAGING_DB_ADMIN_USERNAME,
      admin_password: process.env.MONGO_STAGING_DB_ADMIN_PASSWORD,
      adapter: process.env.MONGO_STAGING_DB_ADAPTER,
      database: process.env.MONGO_STAGING_DB_DATABASE,
      username: process.env.MONGO_STAGING_DB_USERNAME,
      password: process.env.MONGO_STAGING_DB_PASSWORD,
      host: process.env.MONGO_STAGING_DB_HOST,
      port: process.env.MONGO_STAGING_DB_PORT
    },
    production: {
      admin_username: process.env.MONGO_PRODUCTION_DB_ADMIN_USERNAME,
      admin_password: process.env.MONGO_PRODUCTION_DB_ADMIN_PASSWORD,
      adapter: process.env.MONGO_PRODUCTION_DB_ADAPTER,
      database: process.env.MONGO_PRODUCTION_DB_DATABASE,
      username: process.env.MONGO_PRODUCTION_DB_USERNAME,
      password: process.env.MONGO_PRODUCTION_DB_PASSWORD,
      host: process.env.MONGO_PRODUCTION_DB_HOST,
      port: process.env.MONGO_PRODUCTION_DB_PORT
    }
  },
  PG: {
    default: {
      admin_username: process.env.PG_DEFAULT_DB_ADMIN_USERNAME,
      admin_password: process.env.PG_DEFAULT_DB_ADMIN_PASSWORD,
      username: process.env.PG_DEFAULT_DB_USERNAME,
      password: process.env.PG_DEFAULT_DB_PASSWORD,
      host: process.env.PG_DEFAULT_DB_HOST,
      port: process.env.PG_DEFAULT_DB_PORT
    },
    development: {
      admin_username: process.env.PG_DEVELOPMENT_DB_ADMIN_USERNAME,
      admin_password: process.env.PG_DEVELOPMENT_DB_ADMIN_PASSWORD,
      adapter: process.env.PG_DEVELOPMENT_DB_ADAPTER,
      database: process.env.PG_DEVELOPMENT_DB_DATABASE,
      username: process.env.PG_DEVELOPMENT_DB_USERNAME,
      password: process.env.PG_DEVELOPMENT_DB_PASSWORD,
      host: process.env.PG_DEVELOPMENT_DB_HOST,
      port: process.env.PG_DEVELOPMENT_DB_PORT
    },
    test: {
      admin_username: process.env.PG_TEST_DB_ADMIN_USERNAME,
      admin_password: process.env.PG_TEST_DB_ADMIN_PASSWORD,
      adapter: process.env.PG_TEST_DB_ADAPTER,
      database: process.env.PG_TEST_DB_DATABASE,
      username: process.env.PG_TEST_DB_USERNAME,
      password: process.env.PG_TEST_DB_PASSWORD,
      host: process.env.PG_TEST_DB_HOST,
      port: process.env.PG_TEST_DB_PORT
    },
    staging: {
      admin_username: process.env.PG_STAGING_DB_ADMIN_USERNAME,
      admin_password: process.env.PG_STAGING_DB_ADMIN_PASSWORD,
      database: process.env.PG_STAGING_DB_DATABASE,
      adapter: process.env.PG_STAGING_DB_ADAPTER,
      username: process.env.PG_STAGING_DB_USERNAME,
      password: process.env.PG_STAGING_DB_PASSWORD,
      host: process.env.PG_STAGING_DB_HOST,
      port: process.env.PG_STAGING_DB_PORT
    },
    production: {
      admin_username: process.env.PG_PRODUCTION_DB_ADMIN_USERNAME,
      admin_password: process.env.PG_PRODUCTION_DB_ADMIN_PASSWORD,
      adapter: process.env.PG_PRODUCTION_DB_ADAPTER,
      database: process.env.PG_PRODUCTION_DB_DATABASE,
      username: process.env.PG_PRODUCTION_DB_USERNAME,
      password: process.env.PG_PRODUCTION_DB_PASSWORD,
      host: process.env.PG_PRODUCTION_DB_HOST,
      port: process.env.PG_PRODUCTION_DB_PORT
    }
  }
}

function merge(obj1, obj2) {
  let merged = { ...obj1 }

  for (key in obj2) {
    if (merged[key] === undefined || merged[key] === null)
      merged[key] = obj2[key];
  }
  return merged
}

module.exports = (adapter, env) => { return merge(config[adapter][env], config[adapter]["default"]) }
