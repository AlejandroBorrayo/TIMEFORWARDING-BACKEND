/**
 * Dependencias (p. ej. parseurl → Express) usan url.parse(); Node emite DEP0169
 * en cada petición, por eso ves el mismo aviso en muchas rutas.
 * Este módulo debe importarse antes que express en index.ts.
 */
const orig = process.emitWarning.bind(process);

(process as NodeJS.Process & { emitWarning: typeof orig }).emitWarning = (
  ...args: unknown[]
) => {
  const opt = args[1];
  const codeFromOpts =
    opt && typeof opt === "object" && "code" in opt
      ? (opt as { code?: string }).code
      : undefined;
  const codePositional =
    typeof args[2] === "string" ? args[2] : undefined;
  if (codeFromOpts === "DEP0169" || codePositional === "DEP0169") {
    return;
  }
  return (orig as (...a: unknown[]) => void)(...args);
};
