#!/bin/bash

if [ ${GITHUB_ACTIONS:-false} = true ]; then
  mysqladmin -h127.0.0.1 -P${MYSQL_PORT:-3306} -uroot -p${MYSQL_ROOT_PASSWORD} password '';
fi

##
# MySQL
cat <<EOF | mysql -h127.0.0.1 -P${MYSQL_PORT:-3306} -uroot
SET SESSION SQL_MODE='ANSI';
CREATE DATABASE IF NOT EXISTS "egg-orm";
USE "egg-orm";
source test/dumpfile.sql;
EOF
