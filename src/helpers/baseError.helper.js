import httpStatusCodes from "../utils/httpStatusCode.js";

class BaseError extends Error {
  constructor(name, statusCode, message, isOperational, errors = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name || "BaseError";
    this.statusCode = statusCode || 500;
    this.message = message || "Something went wrong";
    this.isOperational = isOperational || true;
    this.errors = errors;
    Error.captureStackTrace(this);
  }
}

export class TransfromError extends BaseError {
  constructor(err) {
    super(
      err?.name,
      err?.statusCode,
      err?.message,
      err?.isOperational,
      err?.errors
    );

    this.responseType = err?.responseType || "page";
    this.renderData = { title: 500 };

    if (err.kind == "ObjectId") {
      this.statusCode = 404;
      this.errorView = "errors/404";
      this.renderData = { title: 404 };
    }
    Object.keys(this.errors).map(x => {
      this[x] = this.errors[x];
    });
    Object.keys(err).map(x => {
      this[x] = err[x];
    });

    delete this.errors;
  }
}

export class ValidationError extends BaseError {
  constructor(err, view, renderOpts) {
    super("Validation", httpStatusCodes.BAD_REQUEST, "Bad Validation", true, {
      errorView: view,
    });
    this.validation = this.#transform(err);
    this.renderData = { ...renderOpts };
  }

  #transform(errorValidation) {
    let errorObj = {};
    const newArrError = [...errorValidation];
    for (let i = 0, len = newArrError.length; i < len; i++) {
      const messageArr = errorValidation
        .filter(item => item.param == newArrError[i]["param"])
        .map(el => el.msg);
      errorObj[newArrError[i]["param"]] = {
        type: newArrError[i]["param"],
        message: messageArr,
      };
    }

    for (let key in errorObj) newArrError.push(errorObj[key]);

    return errorObj;
  }
}

export default BaseError;
