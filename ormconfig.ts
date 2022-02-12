import { db, db_host, db_password, db_port, db_user } from './src/config';

module.exports = [
  {
    "name": "test",
    "type": "mysql",
    "replication": {
      "master": {
        "host": db_host,
        "port": db_port,
        "username": db_user,
        "password": db_password,
        "database": db
      },
      "slaves": [{
        "host": db_host,
        "port": db_port,
        "username": db_user,
        "password": db_password,
        "database": db
      }]
    },
    "synchronize": true,
    "entities": ["src/entity/**/*.ts"],
    "dropSchema": true,
    "logging": ["error"],
    "maxQueryExecutionTime": 1000,
    "extra": {
      "connectionLimit": 150
    }
  },
  {
    "name": "production",
    "type": "mysql",
    "replication": {
      "master": {
        "host": db_host,
        "port": db_port,
        "username": db_user,
        "password": db_password,
        "database": db
      },
      "slaves": [{
        "host": db_host,
        "port": db_port,
        "username": db_user,
        "password": db_password,
        "database": db
      }]
    },
    "synchronize": false,
    "entities": ["src/entity/**/*.ts"]
  }
]
;