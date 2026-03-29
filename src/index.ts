import "./suppress-node-deprecations";
import express from "express";
import bodyParser from "body-parser";
import { connectMongo } from "./database/mongo";
import cors from "cors";
import { upload } from "./middleware/upload";

// Repositorios
import { MongoUserRepository } from "./user/infrastructure/persistence/user.repository";
import { MongoApikeyRepository } from "./apikey/infrastructure/presistence/apikey.repository";
import { MongoFolioRepository } from "./folio/infrastructure/persistence/folio.repository";
import { MongoCustomerRepository } from "./customer/infrastructure/persistence/customer.repository";
import { MongoSupplierRepository } from "./supplier/infrastructure/persistence/supplier.repository";
import { MongoInviteRepository } from "./invite/infrastructure/persistence/invite.repository";
import { MongoNoteRepository } from "./note/infrastructure/persistence/note.repository";
import { MongoTaxRepository } from "./tax/infrastructure/persistence/tax.repository";
import { MongoCompanyRepository } from "./company/infrastructure/persistence/company.repository";

// Servicios
import { FindNoteService } from "./note/application/find-note/find-note.service";
import { CreateNoteService } from "./note/application/create-note/create.service";
import { UpdateNoteService } from "./note/application/update-note/update-note.service";
import { FindAllNoteService } from "./note/application/find-all-note/find-all-note.service";

import { FindTaxService } from "./tax/application/find-tax/find-tax.service";
import { CreateTaxService } from "./tax/application/create-tax/create.service";
import { UpdateTaxService } from "./tax/application/update-tax/update-tax.service";
import { FindAllTaxService } from "./tax/application/find-all-tax/find-all-tax.service";

import { CreateUserService } from "./user/application/create-user/create-user.service";
import { UpdateUserService } from "./user/application/update-user/update-user.service";
import { FindUserService } from "./user/application/find-user/find-user.service";
import { FindAllUserService } from "./user/application/find-all-user/find-all-user.service";
import { LoginService } from "./auth/application/login/login.service";
import { FindApikeyByApikeyService } from "./apikey/application/find-apikey-by/find-apikey-by.service";
import { JwtService } from "./auth/application/jwt/jwt.service";
import { RecoveryPasswordService } from "./auth/application/recovery-password/recovery-password.service";
import { ResetPasswordService } from "./auth/application/reset-password/reset-password.service";

//FOLIO
import { CreateFolioService } from "./folio/application/create-folio/create-folio.service";
import { CreateFolioWithoutCostService } from "./folio/application/create-folio-without-cost/create-folio-without-cost.service";
import { CreateQuoteService } from "./folio/application/create-quote/create-quote.service";
import { FindFolioService } from "./folio/application/find-folio/find-folio.service";
import { FindAllFolioService } from "./folio/application/find-all-folio/find-all-folio.service";
import { SetServiceCostActiveService } from "./folio/application/set-service-cost-active/set-active-service-cost.service";
import { SetQuoteActiveService } from "./folio/application/set-quote-active/set-active-quote.service";
import { FindSupplierHistoryService } from "./folio/application/find-supplier-history/find-supplier-history.service";
import { PaymentSupplierService } from "./folio/application/payment-supplier/payment-supplier.service";
import { CancelPaymentSupplierService } from "./folio/application/cancel-payment-supplier/cancel-payment-supplier.service";
import { FindSuppliersByFolioService } from "./folio/application/find-suppliers-by-folio/find-suppliers-by-folio.service";
import { FindActiveQuotesByCustomerService } from "./folio/application/find-active-quotes-by-customer/find-active-quotes-by-customer.service";
import { PaymentCustomerService } from "./folio/application/payment-customer/payment-customer.service";
import { CancelPaymentCustomerService } from "./folio/application/cancel-payment-customer/cancel-payment-customer.service";
import { FindCustomerHistoryService } from "./folio/application/find-customer-history/find-customer-history.service";
import { SendFolioReportCsvService } from "./folio/application/send-folio-report-csv/send-folio-report-csv.service";

//CUSTOMERS
import { CreateCustomerService } from "./customer/application/create-customer/create-customer.service";
import { FindAllCustomerService } from "./customer/application/find-all-customer/find-all-customer.service";
import { UpdateCustomerService } from "./customer/application/update-customer/update-customer.service";
import { FindCustomerService } from "./customer/application/find-customer/find-customer.service";

//SUPPLIERS
import { CreateSupplierService } from "./supplier/application/create-supplier/create-supplier.service";
import { FindAllSupplierService } from "./supplier/application/find-all-supplier/find-all-supplier.service";
import { UpdateSupplierService } from "./supplier/application/update-supplier/update-supplier.service";
import { FindSupplierService } from "./supplier/application/find-supplier/find-supplier.service";

//INVITE
import { InviteUserService } from "./invite/application/invite-user/invite-user.service";
import { InviteAcceptService } from "./invite/application/invite-accept/invite-accept.service";
import { FindInviteService } from "./invite/application/find-invite/find-invite.service";

import { CreateCompanyService } from "./company/application/create-company/create-company.service";
import { FindAllCompanyService } from "./company/application/find-all-company/find-all-company.service";
import { FindCompanyService } from "./company/application/find-company/find-company.service";
import { UpdateCompanyService } from "./company/application/update-company/update-company.service";

// CONTROLLERS

//USER
import { createUserController } from "./user/controllers/create-user.post/create-user.post.controller";
import { updateUserController } from "./user/controllers/update-user.put/update-user.put.controller";
import { findUserController } from "./user/controllers/find-user.get/find-user.get.controller";
import { findAllUserController } from "./user/controllers/find-all-user.get/find-all-user.get.controller";

//INVITE
import { inviteUserController } from "./invite/controllers/invite-user/invite-user.controller";
import { findInviteController } from "./invite/controllers/find-invite/find-invite.controller";
import { inviteAcceptController } from "./invite/controllers/accept-invite/accept-invite.controller";

// AUTH
import { loginController } from "./auth/controllers/login.post/login.post.controller";
import { recoveryPasswordController } from "./auth/controllers/recovery-password/recovery-password.controller";
import { resetPasswordController } from "./auth/controllers/reset-password/reset-password.controller";

//FOLIO
import { findAllFolioController } from "./folio/controllers/find-all-folio/find-all-folio.controller";
import { createFolioController } from "./folio/controllers/create-folio/create-folio.controller";
import { createFolioWithoutCostController } from "./folio/controllers/create-folio-without-cost/create-folio-without-cost.controller";
import { findFolioController } from "./folio/controllers/find-folio/find-folio.controller";
import { createQuoteController } from "./folio/controllers/create-quote/create-quote.controller";
import { setQuoteActiveController } from "./folio/controllers/set-quote-active/set-quote-active.controller";
import { setServiceCostActiveController } from "./folio/controllers/set-service-cost-active/set-service-cost-active.controller";
import { findSupplierHistoryController } from "./folio/controllers/find-supplier-history/find-supplier-history.controller";
import { PaymentSupplierController } from "./folio/controllers/payment-supplier/payment-supplier.controller";
import { CancelPaymentSupplierController } from "./folio/controllers/cancel-payment-supplier/cancel-payment-supplier.controller";
import { findSuppliersByFolioController } from "./folio/controllers/find-suppliers-by-folio/find-suppliers-by-folio.controller";
import { findActiveQuotesByCustomerController } from "./folio/controllers/find-active-quotes-by-customer/find-active-quotes-by-customer.controller";
import { PaymentCustomerController } from "./folio/controllers/payment-customer/payment-customer.controller";
import { CancelPaymentCustomerController } from "./folio/controllers/cancel-payment-customer/cancel-payment-customer.controller";
import { findCustomerHistoryController } from "./folio/controllers/find-customer-history/find-customer-history.controller";
import { sendFolioReportCsvController } from "./folio/controllers/send-folio-report-csv/send-folio-report-csv.controller";

//CUSTOMER
import { findAllCustomerController } from "./customer/controllers/find-all-customer/find-all-customer.controller";
import { createCustomerController } from "./customer/controllers/create-customer/create-customer.controller";
import { updateCustomerController } from "./customer/controllers/update-customer/update-customer.controller";
import { findCustomerController } from "./customer/controllers/find-customer/find-customer.controller";

//SUPPLIER
import { findAllSupplierController } from "./supplier/controllers/find-all-supplier/find-all-supplier.controller";
import { createSupplierController } from "./supplier/controllers/create-supplier/create-customer.controller";
import { updateSupplierController } from "./supplier/controllers/update-supplier/update-supplier.controller";
import { findSupplierController } from "./supplier/controllers/find-supplier/find-supplier.controller";

//NOTE
import { createNoteController } from "./note/controllers/create-note/create-note.controller";
import { findAllNoteController } from "./note/controllers/find-all-note/find-all-note.controller";
import { findNoteController } from "./note/controllers/find-note/find-note.controller";
import { updateNoteController } from "./note/controllers/update-note/update-note.controller";

//TAX
import { createTaxController } from "./tax/controllers/create-tax/create-tax.controller";
import { findAllTaxController } from "./tax/controllers/find-all-tax/find-all-tax.controller";
import { findTaxController } from "./tax/controllers/find-tax/find-tax.controller";
import { updateTaxController } from "./tax/controllers/update-tax/update-tax.controller";

import { createCompanyController } from "./company/controllers/create-company/create-company.controller";
import { findAllCompanyController } from "./company/controllers/find-all-company/find-all-company.controller";
import { findCompanyController } from "./company/controllers/find-company/find-company.controller";
import { updateCompanyController } from "./company/controllers/update-company/update-company.controller";

// Config
import { MONGO, SECRET, APP } from "./config";
async function bootstrap() {
  const app = express();
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  // ==========================
  // Conexión a MongoDB
  // ==========================
  await connectMongo();

  // ==========================
  // Instancia de Repositorios
  // ==========================
  const userRepo = new MongoUserRepository();
  const apikeyRepo = new MongoApikeyRepository();
  const companyRepo = new MongoCompanyRepository();
  const FolioRepo = new MongoFolioRepository();
  const customerRepo = new MongoCustomerRepository();
  const supplierRepo = new MongoSupplierRepository();
  const inviteRepo = new MongoInviteRepository();
  const noteRepo = new MongoNoteRepository();
  const taxRepo = new MongoTaxRepository();

  // ==========================
  // Instancia de Servicios
  // ==========================
  const createUserService = new CreateUserService(userRepo);
  const updateUserService = new UpdateUserService(userRepo);
  const findUserService = new FindUserService(userRepo);
  const findAllUserService = new FindAllUserService(userRepo);

  const createTaxService = new CreateTaxService(taxRepo);
  const updateTaxService = new UpdateTaxService(taxRepo);
  const findTaxService = new FindTaxService(taxRepo);
  const findAllTaxService = new FindAllTaxService(taxRepo);

  const createCompanyService = new CreateCompanyService(companyRepo);
  const findAllCompanyService = new FindAllCompanyService(companyRepo);
  const findCompanyService = new FindCompanyService(companyRepo);
  const updateCompanyService = new UpdateCompanyService(companyRepo);

  const createnoteService = new CreateNoteService(noteRepo);
  const updateNoteService = new UpdateNoteService(noteRepo);
  const findNoteService = new FindNoteService(noteRepo);
  const findAllNoteService = new FindAllNoteService(noteRepo);

  const inviteAcceptService = new InviteAcceptService(
    createUserService,
    inviteRepo
  );
  const findInviteService = new FindInviteService(inviteRepo);

  const createFolioService = new CreateFolioService(
    userRepo,
    FolioRepo,
    supplierRepo
  );
  const createFolioWithoutCostService = new CreateFolioWithoutCostService(
    userRepo,
    FolioRepo,
  );
  const createQuoteService = new CreateQuoteService(
    userRepo,
    FolioRepo,
    customerRepo
  );
  const findFolioService = new FindFolioService(FolioRepo);
  const setQuoteActiveService = new SetQuoteActiveService(FolioRepo);
  const setServiceCostActiveService = new SetServiceCostActiveService(
    FolioRepo
  );
  const FindSupplierHistory = new FindSupplierHistoryService(FolioRepo);
  const findSuppliersByFolioService = new FindSuppliersByFolioService(
    FolioRepo
  );

  const paymentSupplierService = new PaymentSupplierService(FolioRepo);
  const cancelPaymentSupplierService = new CancelPaymentSupplierService(
    FolioRepo
  );
  const findActiveQuotesByCustomerService =
    new FindActiveQuotesByCustomerService(FolioRepo);
  const paymentCustomerService = new PaymentCustomerService(FolioRepo);
  const cancelPaymentCustomerService = new CancelPaymentCustomerService(
    FolioRepo
  );
  const findCustomerHistoryService = new FindCustomerHistoryService(FolioRepo);
  const sendFolioReportCsvService = new SendFolioReportCsvService(FolioRepo);

  const createCustomerService = new CreateCustomerService(
    userRepo,
    customerRepo
  );
  const findAllCustomerService = new FindAllCustomerService(customerRepo);
  const updateCustomerService = new UpdateCustomerService(customerRepo);
  const findCustomerService = new FindCustomerService(customerRepo);

  const createSupplierService = new CreateSupplierService(supplierRepo);
  const findAllSupplierService = new FindAllSupplierService(supplierRepo);
  const updateSupplierService = new UpdateSupplierService(supplierRepo);
  const findSupplierService = new FindSupplierService(supplierRepo);
  const findAllFolioervice = new FindAllFolioService(FolioRepo);

  const findApikeyService = new FindApikeyByApikeyService(apikeyRepo);
  const jwtService = new JwtService({ secret: SECRET.SECRET });
  const loginConfig = { expiresIn: 3600 }; // 1 hora
  const recoveryPasswordService = new RecoveryPasswordService(
    userRepo,
    inviteRepo,
    jwtService,
    findApikeyService,
    loginConfig
  );

  const resetPasswordService = new ResetPasswordService(
    userRepo,
    inviteRepo,
    jwtService
  );

  const loginService = new LoginService(
    userRepo,
    findApikeyService,
    jwtService,
    loginConfig
  );
  const inviteUserService = new InviteUserService(
    inviteRepo,
    findApikeyService,
    jwtService,
    loginConfig
  );

  // ==========================
  // Instancia de Controladores
  // ==========================
  const createUser = createUserController(createUserService);
  const updateUser = updateUserController(updateUserService);
  const findUser = findUserController(findUserService);
  const login = loginController(loginService);
  const recoveryPassword = recoveryPasswordController(recoveryPasswordService);
  const resetPassword = resetPasswordController(resetPasswordService);

  const findAllFolio = findAllFolioController(findAllFolioervice);
  const FindSuppliersByFolio = findSuppliersByFolioController(
    findSuppliersByFolioService
  );
  const createFolio = createFolioController(createFolioService);
  const createFolioWithoutCost = createFolioWithoutCostController(
    createFolioWithoutCostService,
  );
  const createQuote = createQuoteController(createQuoteService);
  const findFolio = findFolioController(findFolioService);
  const setQuoteActive = setQuoteActiveController(setQuoteActiveService);
  const setServiceCostActive = setServiceCostActiveController(
    setServiceCostActiveService
  );
  const findSupplierHistory =
    findSupplierHistoryController(FindSupplierHistory);

  const paymentSupplier = PaymentSupplierController(paymentSupplierService);
  const cancelPaymentSupplier = CancelPaymentSupplierController(
    cancelPaymentSupplierService
  );
  const findActiveQuotesByCustomer = findActiveQuotesByCustomerController(
    findActiveQuotesByCustomerService
  );
  const paymentCustomer = PaymentCustomerController(paymentCustomerService);
  const cancelPaymentCustomer = CancelPaymentCustomerController(
    cancelPaymentCustomerService
  );
  const findCustomerHistory = findCustomerHistoryController(
    findCustomerHistoryService
  );
  const sendFolioReportCsv = sendFolioReportCsvController(
    sendFolioReportCsvService
  );

  const findAllCustomer = findAllCustomerController(findAllCustomerService);
  const createCustomer = createCustomerController(createCustomerService);
  const updateCustomer = updateCustomerController(updateCustomerService);
  const findCustomer = findCustomerController(findCustomerService);

  const findAllSupplier = findAllSupplierController(findAllSupplierService);
  const createSupplier = createSupplierController(createSupplierService);
  const updateSupplier = updateSupplierController(updateSupplierService);
  const findSupplier = findSupplierController(findSupplierService);

  const findAllUser = findAllUserController(findAllUserService);
  const inviteAcceptUser = inviteAcceptController(inviteAcceptService);
  const inviteUser = inviteUserController(inviteUserService);
  const findInvite = findInviteController(findInviteService);

  const findAllNote = findAllNoteController(findAllNoteService);
  const findNote = findNoteController(findNoteService);
  const createNote = createNoteController(createnoteService);
  const updateNote = updateNoteController(updateNoteService);

  const findAllTax = findAllTaxController(findAllTaxService);
  const findTax = findTaxController(findTaxService);
  const createTax = createTaxController(createTaxService);
  const updateTax = updateTaxController(updateTaxService);

  const createCompany = createCompanyController(createCompanyService);
  const findAllCompany = findAllCompanyController(findAllCompanyService);
  const findCompany = findCompanyController(findCompanyService);
  const updateCompany = updateCompanyController(updateCompanyService);

  // ==========================
  // Rutas
  // ==========================
  app.post("/company", createCompany.run);
  app.post("/company/all", findAllCompany.run);
  app.put("/company/:id", updateCompany.run);
  app.get("/company/:id", findCompany.run);

  app.post("/user", createUser.run);
  app.put("/user/:id", updateUser.run);
  app.get("/user/:userid", findUser.run);
  app.post("/user/all", findAllUser.run);
  app.post("/invite", inviteUser.run);
  app.post("/invite/accept", inviteAcceptUser.run);
  app.get("/invite/:id", findInvite.run);
  app.post("/auth/login", login.run);
  app.post("/auth/recovery-password", recoveryPassword.run);
  app.post("/auth/reset-password", resetPassword.run);
  app.post("/folio/all", findAllFolio.run);
  app.post("/folio/report/csv", sendFolioReportCsv.run);
  app.post("/folio", createFolio.run);
  app.post("/folio/sin-costo", createFolioWithoutCost.run);
  app.get("/folio/:id", findFolio.run);
  app.put("/folio/service-cost-active", setServiceCostActive.run);
  app.put("/folio/quote-active", setQuoteActive.run);
  app.post("/quote", createQuote.run);
  app.post("/customer", createCustomer.run);
  app.post("/customer/all", findAllCustomer.run);
  app.put("/customer/:id", updateCustomer.run);
  app.get("/customer/:id", findCustomer.run);
  app.post("/supplier", createSupplier.run);
  app.post("/supplier/all", findAllSupplier.run);
  app.put("/supplier/:id", updateSupplier.run);
  app.get("/supplier/:id", findSupplier.run);
  app.get("/supplier-history/:id", findSupplierHistory.run);
  app.get("/suppliers-by-folio/:id", FindSuppliersByFolio.run);
  app.post("/supplier-payment", paymentSupplier.run);
  app.post("/supplier-cancel-payment", cancelPaymentSupplier.run);
  app.get("/quotes-by-customer/:id", findActiveQuotesByCustomer.run);
  app.post("/customer-payment", paymentCustomer.run);
  app.post("/customer-cancel-payment", cancelPaymentCustomer.run);
  app.get("/customer-history/:id", findCustomerHistory.run);
  app.post("/note", createNote.run);
  app.post("/note/all", findAllNote.run);
  app.put("/note/:id", updateNote.run);
  app.get("/note/:id", findNote.run);
  app.post("/tax", createTax.run);
  app.post("/tax/all", findAllTax.run);
  app.put("/tax/:id", updateTax.run);
  app.get("/tax/:id", findTax.run);

  // ==========================
  // Iniciar servidor
  // ==========================
  app.listen(APP.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${APP.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Error on bootstrap:", err);
  process.exit(1);
});
