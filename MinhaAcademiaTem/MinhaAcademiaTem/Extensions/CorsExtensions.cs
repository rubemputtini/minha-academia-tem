namespace MinhaAcademiaTem.Extensions
{
    public static class CorsExtensions
    {
        public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigins",
                    policy =>
                    {
                        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>();
                        policy.WithOrigins(allowedOrigins!)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .SetIsOriginAllowedToAllowWildcardSubdomains()
                              .AllowCredentials();
                    });
            });
        }
    }
}
