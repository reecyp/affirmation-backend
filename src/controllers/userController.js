import {
  addUserAffirmationCount,
  createUserAffirmation,
  createUserService,
  deleteUserAffirmation,
  deleteUserService,
  getAllUsersService,
  getUserAffDataService,
  getUsersByIdService,
  increaseAffirmation,
  resetUserAffCountService,
  updateUserService,
} from "../models/userModel.js";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await createUserService(name, email, password);
    await addUserAffirmationCount(newUser.id)
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "User fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUsersByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

export const getUserAffData = async (req, res, next) => {
  try {
    const affData = await getUserAffDataService(req.params.id);
    if (!affData) return handleResponse(res, 404, "Can't find data");
    handleResponse(res, 200, "Data fetched succesfully", affData);
    
  } catch (err) {
    next(err);
  }
}

export const updateUserAff = async (req, res, next) => {
  try {
    const aff = await increaseAffirmation(req.params.id, req.params.affNum);
    if (!aff) return handleResponse(res, 404, "Affirmation not found");
    handleResponse(res, 200, "Affirmation count updated successfully", aff);
  } catch (err) {
    next(err);
  }
};

export const createAff = async (req, res, next) => {
  const { id, affirmation } = req.params;
  try {
    const newAff = await createUserAffirmation(id, affirmation);
    handleResponse(res, 201, "User created successfully", newAff);
  } catch (err) {
    next(err);
  }
};

export const deleteAff = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedAff = await deleteUserAffirmation(id);
    handleResponse(res, 201, "User deleted successfully", deletedAff);
  } catch (err) {
    next(err);
  }
};

export const resetUserAffCount = async (req, res, next) => {
  const { id } = req.params;
  try {
    const resetAffs = await resetUserAffCountService(id);
    handleResponse(res, 201, "Affirmations reset", resetAffs);
  } catch (err) {
    next(err);
  }

  console.log("reset affirmations")
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};
