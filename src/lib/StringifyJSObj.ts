const relIndent = " ".repeat(2);

export interface ConstructorFunc<T extends object> {
  new (...params: unknown[]): T;
}
export type FactoryFunc<T extends object> = (...params: unknown[]) => T;
export type DestructureFunc<T extends object> = (obj: T) => unknown[];

type CustomTypePlugin<T extends object> = {
  destructureFunc: DestructureFunc<T>;
  factory?: FactoryFunc<T>;
  name?: string;
};
const customTypePlugins = new Map<
  ConstructorFunc<object>,
  CustomTypePlugin<object>
>();

class AnnotatedToken {
  constructor(
    public text: string,
    public type: "open" | "close" | "delimiter",
  ) {}
}
type Token = string | AnnotatedToken;
type TokenGenerator = Generator<Token>;

function* makeAttrListTokens(obj: object): TokenGenerator {
  for (const [attrName, attrValue] of Object.entries(obj!)) {
    yield `"${attrName.toString()}": `;
    yield* makeEvalableTokens(attrValue);
    yield new AnnotatedToken(",", "delimiter");
  }
}

function* makeListTokens(obj: unknown[]): TokenGenerator {
  for (const item of obj) {
    yield* makeEvalableTokens(item);
    yield new AnnotatedToken(",", "delimiter");
  }
}

function* makeEvalableTokens(obj: unknown): TokenGenerator {
  if (obj === null) {
    yield "null";
  } else if (obj === undefined) {
    yield "undefined";
  } else if (typeof obj == "number" && isNaN(obj)) {
    yield "NaN";
  } else if (typeof obj == "function") {
    yield "() => {}"; // has to be replaced by other mechanism
  } else if (obj instanceof Array) {
    yield new AnnotatedToken("[", "open");
    yield* makeListTokens(obj);
    yield new AnnotatedToken("]", "close");
  } else if (typeof obj == "object") {
    const constructor = (obj as object).constructor as ConstructorFunc<object>;
    const plugin = customTypePlugins.get(constructor);
    if (plugin === undefined) {
      yield new AnnotatedToken("{", "open");
      yield* makeAttrListTokens(obj);
      yield new AnnotatedToken("}", "close");
    } else {
      if (plugin.name) yield plugin.name;
      else if (plugin.factory) yield plugin.factory.name;
      else yield `new ${constructor.name}`;
      yield new AnnotatedToken("(", "open");
      yield* makeListTokens(plugin.destructureFunc(obj));
      yield new AnnotatedToken(")", "close");
    }
  } else {
    // any other primitive type
    yield JSON.stringify(obj);
  }
}

function* iterateWithLookahead<T>(
  iterable: Iterable<T>,
  func: (element: T, lookahead: T | undefined) => Generator<T>,
): Generator<T> {
  let element: undefined | T = undefined;
  for (const lookahead of iterable) {
    if (element !== undefined) yield* func(element, lookahead);
    element = lookahead;
  }
  if (element !== undefined) yield* func(element, undefined);
}

function* wrapTokens(tokenGen: TokenGenerator): TokenGenerator {
  let curIndent = "\n";
  yield* iterateWithLookahead(
    tokenGen,
    function* (curToken: Token, nextToken: Token | undefined) {
      const curTokenType = (curToken as AnnotatedToken).type;
      const nextTokenType = (nextToken as AnnotatedToken)?.type;
      if (curTokenType == "open") {
        yield curToken;
        if (nextTokenType != "close") {
          // keep empty structures on a single line
          curIndent = curIndent + relIndent;
          yield curIndent;
        }
      } else {
        if (curTokenType != "delimiter" || nextTokenType != "close")
          // output only non-trailing delimiter
          yield curToken;
        if (nextTokenType == "close")
          curIndent = curIndent.slice(0, -relIndent.length);
        if (curTokenType == "delimiter") yield curIndent;
      }
    },
  );
}

/**
 * converts a javascript object back into code that can be evaluated.
 *
 * limitations:
 * - objects with prototypes requires plugins (see registerCustomType())
 * - non displayable objects (i.e. functions or DOM elements) are not supported
 *   yet
 */
export function stringifyJSObj(obj: unknown, multiline = true): string {
  let tokenGen = makeEvalableTokens(obj);
  if (multiline) tokenGen = wrapTokens(tokenGen);
  return [...tokenGen]
    .map((t) => (t instanceof AnnotatedToken ? t.text : t)) // remove annotations
    .join("");
}

/**
 * evaluates a string and returns the corresponding JS object.
 *
 * inverse of `stringifyJSObj`
 */
export function unstringifyJSObj(objStr: string): unknown {
  const namespace = Array.from(customTypePlugins.entries()).map(
    ([constr, plugin]) => [
      plugin.name ?? plugin.factory?.name ?? constr.name,
      plugin.factory ?? constr,
    ],
  );
  const varNameList = namespace.map(([nm, _func]) => nm).join(",");
  const valueCreator = eval(`({${varNameList}}) => (${objStr})`);
  return valueCreator(Object.fromEntries(namespace));
}

/**
 * Register Custom types that shall be renderable to an evalable string.
 *
 * @param constructorFunc This has to be either the constructor (i.e. <Date>)
 *                        or a factory function (i.e. <dayjs>)
 * @param destructureFunc This has to be a function that deconstructs an
 *                        instance of the class into the parameters that were
 *                        passed to the constructor.
 * @param options         Sometimes an object shall not be created via
 *                        constructor but via factory. In this case the factory
 *                        func can be passed here.
 *                        Furthermore optionally a different name can be
 *                        specified.
 */
export function registerCustomType<T extends object>(
  constructorFunc: ConstructorFunc<T>,
  destructureFunc: DestructureFunc<T>,
  options?: {
    factory?: FactoryFunc<T>;
    name?: string;
  },
) {
  const name = options?.name ?? options?.factory?.name ?? constructorFunc.name;
  if (customTypePlugins.has(constructorFunc))
    throw new Error(`The Plugin "${name}" was registered twice`);
  const custTypePlugin = (<object>{
    destructureFunc,
    ...options,
  }) as CustomTypePlugin<object>;
  customTypePlugins.set(constructorFunc, custTypePlugin);
  return true;
}

// register plugins for standard prototypes:
registerCustomType(Date, (obj) => [obj.toISOString()]);
