const getNestedValue = (object, path) => {
    return path.split(".").reduce((current, key) => {
        if(current == null || current == undefined){
            return undefined;
        }
        return current[key];
    },object);
};

const parseExpectedValue = (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue === "true") {
        return true;
    }

    if (trimmedValue === "false") {
        return false;
    }

    if (trimmedValue === "null") {
        return null;
    }

    if (
        trimmedValue !== "" &&
        !Number.isNaN(Number(trimmedValue))
    ) {
        return Number(trimmedValue);
    }

    return trimmedValue;
};

export const validateResponseBody = (body, rule) => {
    if (!rule) {
        return null;
    }

    const separatorIndex = rule.indexOf("=");

    if (separatorIndex === -1) {
        return false;
    }

    const field = rule.slice(0, separatorIndex).trim();
    const expectedValue = parseExpectedValue(
        rule.slice(separatorIndex + 1)
    );

    if (!field) {
        return false;
    }

    const actualValue = getNestedValue(body, field);

    return actualValue === expectedValue;
};