import { Controller, Get, Route } from "tsoa";

@Route("auth")
export class UserController extends Controller {
  @Get("/")
  public async GetStatus(): Promise<string> {
    return "Ok";
  }
}
