# pip install psycopg2-binary
# python-decouple
import psycopg2
from decouple import config
from psycopg2 import sql


class PostgresCursor:

    def __enter__(self):
        create_database()

        self.conn = psycopg2.connect(
            database=config("DB_NAME"),
            host=config("DB_HOST"),
            user=config("DB_USER"),
            password=config("DB_PASSWORD"),
            port=config("DB_PORT")
        )

        # self.conn.row_factory = psycopg2.Row
        return self.conn.cursor()

    def __exit__(self, _type, value, traceback):
        self.conn.commit()
        self.conn.close()


def create_database():
    """create database if not exists"""

    conn = psycopg2.connect(
        dbname='postgres',
        host=config("DB_HOST"),
        user=config("DB_USER"),
        password=config("DB_PASSWORD"),
        port=config("DB_PORT")
    )

    """
    isolation levels

    0 -> autocommit
    1 -> read committed
    2 -> serialized (but not officially supported by pg)
    3 -> serialized
    """
    conn.set_isolation_level(0)

    cursor = conn.cursor()
    database = config("DB_NAME")
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s;",
                   (database,))
    exists = cursor.fetchone()

    if not exists:
        cursor.execute(
            sql.SQL("CREATE DATABASE {table}")
            .format(table=sql.Identifier(database))
        )

    conn.commit()
    cursor.close()
    conn.close()
