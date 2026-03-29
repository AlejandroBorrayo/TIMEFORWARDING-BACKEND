// src/transaction/infrastructure/persistence/mongo-transaction.repository.ts
import { FolioModel } from "./schema/folio.schema";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import { Types, UpdateQuery } from "mongoose";

export class MongoFolioRepository implements FolioRepositoryInterface {
  private static readonly CDMX_UTC_OFFSET = "-06:00";

  private isDateOnlyString(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private buildDateForMexicoCity(
    value: string | Date,
    options?: { endOfDay?: boolean },
  ): Date {
    if (value instanceof Date) {
      return new Date(value);
    }

    if (!this.isDateOnlyString(value)) {
      return new Date(value);
    }

    const time = options?.endOfDay ? "23:59:59.999" : "00:00:00.000";
    return new Date(
      `${value}T${time}${MongoFolioRepository.CDMX_UTC_OFFSET}`,
    );
  }

  async create(
    quote: Partial<FolioCollectionInterface>,
  ): Promise<FolioCollectionInterface> {
    const newTransaction = new FolioModel({
      ...quote,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const saved = await newTransaction.save();
    return saved.toObject<FolioCollectionInterface>();
  }

  async findAll(data: {
    pagination: { page: number; perpage: number };
    folio?: string;
    seller_name?: string;
    no_quote?: number;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    supplier?: string;
  }): Promise<[any[], number]> {
    const match: any = { deleted: false };

    if (data?.company_id?.trim()) {
      match.company_id = new Types.ObjectId(data.company_id.trim());
    }

    if (data?.folio) {
      match.folio = { $regex: data.folio, $options: "i" };
    }

    if (data?.seller_userid) {
      match.seller_userid = new Types.ObjectId(data.seller_userid);
    }

    if (data?.no_quote) {
      match.no_quote = data.no_quote;
    }
    if (data?.supplier) {
      match.service_cost = {
        $elemMatch: {
          items: {
            $elemMatch: {
              "supplier._id": new Types.ObjectId(data.supplier),
            },
          },
        },
      };
    }

    if (data?.start_date || data?.end_date) {
      match.created_at = {};
      if (data.start_date) {
        const startDate = this.buildDateForMexicoCity(data.start_date);
        match.created_at.$gte = startDate;
      }

      if (data.end_date) {
        const endDate = this.buildDateForMexicoCity(data.end_date, {
          endOfDay: true,
        });
        match.created_at.$lte = endDate;
      }
    }

    const pipeline: any[] = [
      { $match: match },

      {
        $lookup: {
          from: "users",
          localField: "seller_userid",
          foreignField: "_id",
          as: "seller_userid",
        },
      },
      {
        $unwind: {
          path: "$seller_userid",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    if (data?.seller_name) {
      pipeline.push({
        $match: {
          $or: [
            {
              "seller_userid.full_name": {
                $regex: data.seller_name,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    pipeline.push({
      $project: {
        folio: 1,
        company_id: 1,
        quotes: 1,
        service_cost: 1,
        created_at: 1,
        seller_userid: {
          _id: "$seller_userid._id",
          full_name: "$seller_userid.full_name",
          email: "$seller_userid.email",
          phone: "$seller_userid.phone",
          role: "$seller_userid.role",
          commission: "$seller_userid.commission",
          type_commission: "$seller_userid.type_commission",
        },
      },
    });

    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push(
      { $sort: { created_at: -1 } },
      { $skip: (data.pagination.page - 1) * data.pagination.perpage },
      { $limit: data.pagination.perpage },
    );

    const [items, count] = await Promise.all([
      FolioModel.aggregate(pipeline),
      FolioModel.aggregate(countPipeline),
    ]);

    return [items, count[0]?.total || 0];
  }

  async findAllForReport(data: {
    folio?: string;
    seller_name?: string;
    no_quote?: number;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    supplier?: string;
  }): Promise<any[]> {
    const match: any = { deleted: false };

    if (data?.company_id?.trim()) {
      match.company_id = new Types.ObjectId(data.company_id.trim());
    }

    if (data?.folio) {
      match.folio = { $regex: data.folio, $options: "i" };
    }

    if (data?.seller_userid) {
      match.seller_userid = new Types.ObjectId(data.seller_userid);
    }

    if (data?.no_quote) {
      match.no_quote = data.no_quote;
    }

    if (data?.supplier) {
      match.service_cost = {
        $elemMatch: {
          items: {
            $elemMatch: {
              "supplier._id": new Types.ObjectId(data.supplier),
            },
          },
        },
      };
    }

    if (data?.start_date || data?.end_date) {
      match.created_at = {};
      if (data.start_date) {
        const startDate = this.buildDateForMexicoCity(data.start_date);
        match.created_at.$gte = startDate;
      }

      if (data.end_date) {
        const endDate = this.buildDateForMexicoCity(data.end_date, {
          endOfDay: true,
        });
        match.created_at.$lte = endDate;
      }
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "seller_userid",
          foreignField: "_id",
          as: "seller_userid",
        },
      },
      {
        $unwind: {
          path: "$seller_userid",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (data?.seller_name) {
      pipeline.push({
        $match: {
          "seller_userid.full_name": {
            $regex: data.seller_name,
            $options: "i",
          },
        },
      });
    }

    pipeline.push(
      {
        $project: {
          folio: 1,
          company_id: 1,
          quotes: 1,
          service_cost: 1,
          created_at: 1,
          seller_userid: {
            _id: "$seller_userid._id",
            full_name: "$seller_userid.full_name",
            email: "$seller_userid.email",
            phone: "$seller_userid.phone",
            role: "$seller_userid.role",
            commission: "$seller_userid.commission",
            type_commission: "$seller_userid.type_commission",
          },
        },
      },
      { $sort: { created_at: -1 } },
    );

    return FolioModel.aggregate(pipeline);
  }

  async findOne(folio: string): Promise<FolioCollectionInterface | null> {
    return FolioModel.findOne({ folio })
      .populate("seller_userid")
      .lean<FolioCollectionInterface>()
      .exec();
  }

  async findFolioByFolio(
    folio: string,
  ): Promise<FolioCollectionInterface | null> {
    return FolioModel.findOne({ folio })
      .lean<FolioCollectionInterface>()
      .exec();
  }

  async updateById(
    _id: string,
    update: UpdateQuery<FolioCollectionInterface>,
    options: any = {},
  ): Promise<FolioCollectionInterface | null> {
    return FolioModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_id), deleted: false },
      update,
      {
        new: true,
        ...options,
      },
    )
      .lean<FolioCollectionInterface>()
      .exec();
  }

  async setActiveServiceCost(
    folioId: string,
    noServiceCost: string,
  ): Promise<FolioCollectionInterface | null> {
    FolioModel.findOneAndUpdate(
      { _id: new Types.ObjectId(folioId), deleted: false },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $mergeObjects: [
                    "$$sc",
                    {
                      active: { $eq: ["$$sc.no_service_cost", noServiceCost] },
                      updated_at: {
                        $cond: [
                          { $eq: ["$$sc.no_service_cost", noServiceCost] },
                          "$$NOW",
                          "$$sc.updated_at",
                        ],
                      },
                    },
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    )
      .lean()
      .exec();
    return FolioModel.findOne({ _id: new Types.ObjectId(folioId) })
      .lean<FolioCollectionInterface>()
      .exec();
  }

  async setActiveQuote(
    folioId: string,
    noQuote: string,
  ): Promise<FolioCollectionInterface | null> {
    FolioModel.findOneAndUpdate(
      { _id: new Types.ObjectId(folioId), deleted: false },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $mergeObjects: [
                    "$$sc",
                    {
                      quotes: {
                        $map: {
                          input: "$$sc.quotes",
                          as: "q",
                          in: {
                            $mergeObjects: [
                              "$$q",
                              {
                                active: { $eq: ["$$q.no_quote", noQuote] },
                                updated_at: {
                                  $cond: [
                                    { $eq: ["$$q.no_quote", noQuote] },
                                    "$$NOW",
                                    "$$q.updated_at",
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    )
      .lean()
      .exec();
    return FolioModel.findOne({ _id: new Types.ObjectId(folioId) })
      .lean<FolioCollectionInterface>()
      .exec();
  }

  async findSupplierHistory(supplierId: string): Promise<any[]> {
    return FolioModel.aggregate([
      {
        $match: {
          deleted: false,
        },
      },

      {
        $unwind: "$service_cost",
      },

      {
        $match: {
          "service_cost.active": true,
        },
      },

      {
        $unwind: "$service_cost.items",
      },

      {
        $match: {
          "service_cost.items.supplier._id": new Types.ObjectId(supplierId),
        },
      },
      {
        $project: {
          _id: 0,
          folio: 1,
          service_cost_id: "$service_cost._id",
          no_service_cost: "$service_cost.no_service_cost",
          item: "$service_cost.items",
          supplier: "$service_cost.items.supplier",
        },
      },
    ]).exec();
  }

  async findSuppliersByFolio(folio: string): Promise<any[]> {
    return FolioModel.aggregate([
      {
        $match: {
          folio,
          deleted: false,
        },
      },

      {
        $unwind: "$service_cost",
      },

      {
        $match: {
          "service_cost.active": true,
          "service_cost.deleted": false,
        },
      },

      {
        $unwind: "$service_cost.items",
      },

      {
        $match: {
          "service_cost.items.supplier": { $exists: true },
        },
      },

      {
        $group: {
          _id: "$service_cost.items.supplier._id",
          supplier: { $first: "$service_cost.items.supplier" },
          items: { $push: "$service_cost.items" },
          total_amount: { $sum: "$service_cost.items.total" },
          total_items: { $sum: 1 },
          folio: { $first: "$folio" },
        },
      },

      {
        $project: {
          _id: 0,
          supplier_id: "$_id",
          supplier: 1,
          items: 1,
          total_amount: 1,
          total_items: 1,
          folio: 1,
        },
      },
    ]).exec();
  }

  async paymentSupplier(data: {
    payment: number;
    currency: string;
    itemid: string;
  }): Promise<any | null> {
    const { payment, itemid, currency } = data;

    return FolioModel.findOneAndUpdate(
      {
        deleted: false,
        "service_cost.active": true,
        "service_cost.items._id": new Types.ObjectId(itemid),
      },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.active", true] },
                    {
                      $mergeObjects: [
                        "$$sc",
                        {
                          items: {
                            $map: {
                              input: "$$sc.items",
                              as: "item",
                              in: {
                                $cond: [
                                  {
                                    $eq: [
                                      "$$item._id",
                                      new Types.ObjectId(itemid),
                                    ],
                                  },
                                  {
                                    $mergeObjects: [
                                      "$$item",
                                      {
                                        supplier: {
                                          $mergeObjects: [
                                            "$$item.supplier",
                                            {
                                              history: {
                                                $concatArrays: [
                                                  "$$item.supplier.history",
                                                  [
                                                    {
                                                      _id: new Types.ObjectId(),
                                                      payment,
                                                      status: "paid",
                                                      currency,
                                                      created_at: "$$NOW",
                                                      updated_at: "$$NOW",
                                                    },
                                                  ],
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "$$item",
                                ],
                              },
                            },
                          },
                          updated_at: "$$NOW",
                        },
                      ],
                    },
                    "$$sc",
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    ).exec();
  }

  async findActiveQuotesByCustomer(customerId: string, sellerId?: string): Promise<any[]> {
    const match: any = { deleted: false };
    if (sellerId) {
      match.seller_userid = new Types.ObjectId(sellerId);
    }

    return FolioModel.aggregate([
      { $match: match },
      { $unwind: "$service_cost" },
      { $unwind: "$service_cost.quotes" },
      {
        $match: {
          "service_cost.active": true,
          "service_cost.quotes.active": true,
          "service_cost.quotes.customer_id": new Types.ObjectId(customerId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "seller_userid",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          folio: 1,
          created_at: 1,
          seller: {
            _id: "$seller._id",
            full_name: "$seller.full_name",
            commission: "$seller.commission",
            type_commission: "$seller.type_commission",
          },
          service_cost: {
            _id: "$service_cost._id",
            no_service_cost: "$service_cost.no_service_cost",
            active: "$service_cost.active",
          },
          quote: "$service_cost.quotes",
        },
      },
    ]).exec();
  }

  async paymentCustomer(data: {
    payment: number;
    currency: string;
    quoteid: string;
  }): Promise<any | null> {
    const { payment, quoteid, currency } = data;

    return FolioModel.findOneAndUpdate(
      {
        deleted: false,
        "service_cost.active": true,
        "service_cost.quotes._id": new Types.ObjectId(quoteid),
        "service_cost.quotes.active": true,
      },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.active", true] },
                    {
                      $mergeObjects: [
                        "$$sc",
                        {
                          quotes: {
                            $map: {
                              input: "$$sc.quotes",
                              as: "q",
                              in: {
                                $cond: [
                                  {
                                    $and: [
                                      {
                                        $eq: [
                                          "$$q._id",
                                          new Types.ObjectId(quoteid),
                                        ],
                                      },
                                      { $eq: ["$$q.active", true] },
                                    ],
                                  },
                                  {
                                    $mergeObjects: [
                                      "$$q",
                                      {
                                        history: {
                                          $concatArrays: [
                                            {
                                              $ifNull: ["$$q.history", []],
                                            },
                                            [
                                              {
                                                _id: new Types.ObjectId(),
                                                payment,
                                                status: "paid",
                                                currency,
                                                created_at: "$$NOW",
                                                updated_at: "$$NOW",
                                              },
                                            ],
                                          ],
                                        },
                                        updated_at: "$$NOW",
                                      },
                                    ],
                                  },
                                  "$$q",
                                ],
                              },
                            },
                          },
                          updated_at: "$$NOW",
                        },
                      ],
                    },
                    "$$sc",
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    ).exec();
  }

  async cancelPaymentCustomer(data: {
    historyid: string;
    quoteid: string;
  }): Promise<any | null> {
    const { historyid, quoteid } = data;

    return FolioModel.findOneAndUpdate(
      {
        deleted: false,
        "service_cost.active": true,
        "service_cost.quotes._id": new Types.ObjectId(quoteid),
        "service_cost.quotes.history._id": new Types.ObjectId(historyid),
      },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.active", true] },
                    {
                      $mergeObjects: [
                        "$$sc",
                        {
                          quotes: {
                            $map: {
                              input: "$$sc.quotes",
                              as: "q",
                              in: {
                                $cond: [
                                  {
                                    $eq: [
                                      "$$q._id",
                                      new Types.ObjectId(quoteid),
                                    ],
                                  },
                                  {
                                    $mergeObjects: [
                                      "$$q",
                                      {
                                        history: {
                                          $map: {
                                            input: "$$q.history",
                                            as: "h",
                                            in: {
                                              $cond: [
                                                {
                                                  $eq: [
                                                    "$$h._id",
                                                    new Types.ObjectId(
                                                      historyid,
                                                    ),
                                                  ],
                                                },
                                                {
                                                  $mergeObjects: [
                                                    "$$h",
                                                    {
                                                      status: "cancelled",
                                                      updated_at: "$$NOW",
                                                    },
                                                  ],
                                                },
                                                "$$h",
                                              ],
                                            },
                                          },
                                        },
                                        updated_at: "$$NOW",
                                      },
                                    ],
                                  },
                                  "$$q",
                                ],
                              },
                            },
                          },
                          updated_at: "$$NOW",
                        },
                      ],
                    },
                    "$$sc",
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    ).exec();
  }

  async findCustomerHistory(customerId: string): Promise<any[]> {
    return FolioModel.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
      {
        $unwind: "$service_cost",
      },
      {
        $match: {
          "service_cost.active": true,
        },
      },
      {
        $unwind: "$service_cost.quotes",
      },
      {
        $match: {
          "service_cost.quotes.active": true,
          "service_cost.quotes.customer_id": new Types.ObjectId(customerId),
        },
      },
      {
        $project: {
          _id: 0,
          folio: 1,
          service_cost_id: "$service_cost._id",
          no_service_cost: "$service_cost.no_service_cost",
          quote: {
            _id: "$service_cost.quotes._id",
            no_quote: "$service_cost.quotes.no_quote",
            currency: "$service_cost.quotes.currency",
            total: "$service_cost.quotes.total",
            customer: "$service_cost.quotes.customer",
          },
          history: "$service_cost.quotes.history",
        },
      },
    ]).exec();
  }

  async cancelPaymentSupplier(data: {
    historyid: string;
    itemid: string;
  }): Promise<any | null> {
    const { historyid, itemid } = data;

    return FolioModel.findOneAndUpdate(
      {
        deleted: false,
        "service_cost.active": true,
        "service_cost.items._id": new Types.ObjectId(itemid),
        "service_cost.items.supplier.history._id": new Types.ObjectId(
          historyid,
        ),
      },
      [
        {
          $set: {
            service_cost: {
              $map: {
                input: "$service_cost",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.active", true] },
                    {
                      $mergeObjects: [
                        "$$sc",
                        {
                          items: {
                            $map: {
                              input: "$$sc.items",
                              as: "item",
                              in: {
                                $cond: [
                                  {
                                    $eq: [
                                      "$$item._id",
                                      new Types.ObjectId(itemid),
                                    ],
                                  },
                                  {
                                    $mergeObjects: [
                                      "$$item",
                                      {
                                        supplier: {
                                          $mergeObjects: [
                                            "$$item.supplier",
                                            {
                                              history: {
                                                $map: {
                                                  input:
                                                    "$$item.supplier.history",
                                                  as: "h",
                                                  in: {
                                                    $cond: [
                                                      {
                                                        $eq: [
                                                          "$$h._id",
                                                          new Types.ObjectId(
                                                            historyid,
                                                          ),
                                                        ],
                                                      },
                                                      {
                                                        $mergeObjects: [
                                                          "$$h",
                                                          {
                                                            status: "cancelled",
                                                            updated_at: "$$NOW",
                                                          },
                                                        ],
                                                      },
                                                      "$$h",
                                                    ],
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                  "$$item",
                                ],
                              },
                            },
                          },
                          updated_at: "$$NOW",
                        },
                      ],
                    },
                    "$$sc",
                  ],
                },
              },
            },
            updated_at: "$$NOW",
          },
        },
      ],
      { new: true },
    ).exec();
  }
}
