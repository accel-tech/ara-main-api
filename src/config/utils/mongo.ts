import { connect, startSession, connection, set } from "mongoose";
import {
  Filter,
  FindOptions,
  InsertOneOptions,
  DeleteOptions,
  UpdateFilter,
  UpdateOptions,
  OptionalUnlessRequiredId,
  ObjectId,
  BulkWriteOptions,
  OptionalId
} from "mongodb";
import { xRequestHandler } from "../types/request";
import { Doc, OptionalIdNoVersion } from "../types/doc";

export const connectDatabase = async () => {
  await connectMongoDB();
  await createCollections();
  // set("debug", true);
};

async function connectMongoDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable not found.");
  }
  await connect(uri, {});
  console.log("MongoDb database connected...");
}

async function createCollections() {
  /*
    Transactions cannot create collection at the same time as insert. So collection must be created in advance
    */
  for (const colName of []) {
    try {
      await connection.createCollection(colName);
    } catch {}
  }
}

export const usesTransaction: xRequestHandler = async (req, res, next) => {
  req.session = await startSession();
  req.session.startTransaction();
  return next();
};

export function getModel<Type extends Doc, CreateType>(
  collectionName: string,
  settings?: {
    objectValidation?: (data: OptionalIdNoVersion<CreateType>) => void;
  }
) {
  const Collection = connection.db!.collection<Type>(collectionName);

  return class Model {
    static find(filter: Filter<Type> = {}, options: FindOptions = {}) {
      return Collection.find(filter, options).toArray();
    }

    static findOne(filter: Filter<Type> = {}, options: FindOptions = {}) {
      return Collection.findOne(filter, options);
    }

    static async create(data: OptionalIdNoVersion<CreateType>, options: InsertOneOptions = {}) {
      const __v = 0;
      settings?.objectValidation?.(data);
      const result = await Collection.insertOne(
        { ...data, __v } as unknown as OptionalUnlessRequiredId<Type>,
        options
      );
      return { ...data, _id: result.insertedId, __v };
    }

    static async insertMany(
      data: OptionalIdNoVersion<CreateType>[],
      options: BulkWriteOptions = {}
    ) {
      if (settings?.objectValidation) {
        data.forEach((doc) => settings.objectValidation!(doc));
      }

      const objects = data.map((obj) => ({ ...obj, __v: 0 }));

      const result = await Collection.insertMany(
        objects as unknown as OptionalUnlessRequiredId<Type>[],
        options
      );

      return objects.map((d, i) => ({ ...d, _id: result.insertedIds[i] }));
    }

    static deleteOne(filter: Filter<Type>, options: DeleteOptions = {}) {
      return Collection.deleteOne(filter, options);
    }

    static updateOne(
      filter: Filter<Type>,
      // not type safe -_-
      change: UpdateFilter<Type>,
      options: UpdateOptions = {}
    ) {
      change.$inc ??= {};
      // @ts-ignore
      change.$inc["__v"] = 1;
      return Collection.updateOne(filter, change, options);
    }
    static updateMany(
      filter: Filter<Type>,
      change: UpdateFilter<Type>,
      options: UpdateOptions = {}
    ) {
      change.$inc ??= {};
      // @ts-ignore
      change.$inc["__v"] = 1;

      return Collection.updateMany(filter, change, options);
    }
  };
}

/*
await db.command({
            "collMod": process.env.GAMES_COLLECTION_NAME,
            "validator": {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "price", "category"],
                    additionalProperties: false,
                    properties: {
                    _id: {},
                    name: {
                        bsonType: "string",
                        description: "'name' is required and is a string"
                    },
                    price: {
                        bsonType: "number",
                        description: "'price' is required and is a number"
                    },
                    category: {
                        bsonType: "string",
                        description: "'category' is required and is a string"
                    }
                    }
                }
             }
        });
*/
