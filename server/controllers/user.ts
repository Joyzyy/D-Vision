import type { Request, Response } from "express";
import type { PrismaClient, user, user_role } from "@prisma/client";
import { Router } from "express";
import { STATUS_CODES } from "../constants";
import { checkAuthorization } from "../middlewares/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export { UserController };

interface ExtendedRequest extends Request {
  userId?: number;
}

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
    this.router.get("/current", checkAuthorization, this.getCurrentUser);
    this.router.get("/role/:role", this.getUsersByRole);
    this.router.post("/create", this.createUser);
    this.router.post("/login", this.loginUser);
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
   * Retrieves the current user from the database and sends it as a JSON response.
   *
   * @async
   * @function
   * @param {Request} _ - The request object (unused).
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the users from the database.
   */
  getCurrentUser = async (
    req: ExtendedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req;
      const user: Omit<user, "id" | "password"> | null =
        await this.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
          select: {
            name: true,
            email: true,
            role: true,
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
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(data.password as string, salt);
      const user: user | null = await this.prisma.user.create({
        data: {
          ...data,
          role: data.role as user_role,
          password: hashedPassword,
        },
      });

      if (!user) {
        throw new Error("User could not be created");
      }

      // if the user is created successfully, generate a jwt token
      const token = jwt.sign(
        {
          id: user.id.toString(),
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      res.status(STATUS_CODES.SUCCESS).json({
        token,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: error.message,
      });
    }
  };

  /**
   * Logs in a user and sends a jwt token as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error creating the user in the database.
   */
  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: {
        email: string;
        password: string;
      } = req.body;

      const user: user | null = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new Error("User not found!");
      }

      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password as string
      );
      if (!isPasswordCorrect) {
        throw new Error("Password is incorrect!");
      }

      const token = jwt.sign(
        {
          id: user.id.toString(),
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      res.status(STATUS_CODES.SUCCESS).json({
        token,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: error.message,
      });
    }
  };
}
