import type { Request, Response } from "express";
import type { PrismaClient, user, user_role } from "@prisma/client";
import { Router } from "express";
import { STATUS_CODES } from "../constants";
import { checkJwt } from "../middlewares/auth";

export { UserController };

class UserController {
  public router: Router;

  constructor(private readonly prisma: PrismaClient) {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initializes the router for the UserController.
   *
   * @returns {void}
   */
  initializeRoutes = (): void => {
    this.router.get("/", this.getUsers);
    this.router.get("/:id", checkJwt, this.getUser);
    this.router.get("/role/:role", this.getUsersByRole);
    this.router.post("/", this.createUser);
  };

  /**
   * Retrieves all users from the database and sends them as a JSON response.
   *
   * @async
   * @function
   * @param {Request} _ - The request object (unused).
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the users from the database.
   */
  getUsers = async (_: Request, res: Response): Promise<void> => {
    try {
      const users: user[] = await this.prisma.user.findMany();
      res.status(STATUS_CODES.SUCCESS).json({
        users,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };

  /**
   * Retrieves all users with a specific role from the database and sends them as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the users from the database.
   */
  getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.params;
      const users: user[] | null = await this.prisma.user.findMany({
        where: {
          role: role as user_role,
        },
      });
      res.status(STATUS_CODES.SUCCESS).json({
        users,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };

  /**
   * Retrieves a single user from the database by their ID and sends it as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the user from the database.
   */
  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user: user | null = await this.prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      res.status(STATUS_CODES.SUCCESS).json({
        user,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };

  /**
   * Creates a new user in the database and sends the created user as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error creating the user in the database.
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: user = req.body;
      const user: user | null = await this.prisma.user.create({
        data,
      });
      res.status(STATUS_CODES.SUCCESS).json({
        user,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };
}
