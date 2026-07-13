from src.parse_db import PostgresBackend
be = PostgresBackend("postgresql://dgiot:dgiot123@127.0.0.1:7432/parse")
be.connect()
cols = "objectId TEXT PRIMARY KEY, data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT"
print("Input:", cols)
pg = cols.replace("data TEXT DEFAULT '{}'", "data JSONB DEFAULT '{}'::jsonb")
pg = pg.replace("ACL TEXT DEFAULT '{}'", "ACL JSONB DEFAULT '{}'::jsonb")
print("Output:", pg)
# Now actually create table
import asyncio
async def test():
    async with be._pool.acquire() as conn:
        try:
            await conn.execute('DROP TABLE IF EXISTS debug_test')
            await conn.execute(f'CREATE TABLE debug_test ({pg})')
            print("CREATE OK")
            await conn.execute('DROP TABLE debug_test')
        except Exception as e:
            print(f"ERROR: {e}")
asyncio.run(test())
