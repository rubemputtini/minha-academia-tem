using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace MinhaAcademiaTem.Helpers
{
    public static class ApiResponseHelper
    {
        public static IActionResult GenerateErrorResponse(ModelStateDictionary modelState)
        {
            var errors = modelState.Values.SelectMany(v => v.Errors)
                                          .Select(e => e.ErrorMessage)
                                          .ToList();
            return new BadRequestObjectResult(new { Message = "Erro de validação.", Details = errors });
        }
    }
}
