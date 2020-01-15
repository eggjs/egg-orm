##
# MySQL
cat <<EOF | mysql -uroot
SET SESSION SQL_MODE='ANSI';
CREATE DATABASE IF NOT EXISTS "egg-orm";
USE "egg-orm";
source test/dumpfile.sql;
EOF
