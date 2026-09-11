import {CheckResult} from "../../../server/src/modules/checks/checkResult.model.js"

export const saveCheckResult = async (result) => {
  return CheckResult.create(result);
};