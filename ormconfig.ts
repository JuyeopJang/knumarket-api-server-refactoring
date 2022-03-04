import { db, db_host, db_password, db_port, db_user } from './src/config';

module.exports = [
  {
    "name": "test",
    "type": "mysql",
    "replication": {
      "master": {
        "host": "localhost",
        "port": "3306",
        "username": "root",
        "password": "cr7!cr7!",
        "database": "knumarket_auth"
      },
      "slaves": [{
        "host": "localhost",
        "port": "3306",
        "username": "root",
        "password": "cr7!cr7!",
        "database": "knumarket_auth"
      }]
    },
    "synchronize": true,
    "entities": ["src/entity/**/*.ts"],
    "logging": true,
    "maxQueryExecutionTime": 1000,
    "dropSchema": true
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
  }];