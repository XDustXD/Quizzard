using System;
using Domain;

namespace Domain.Interfaces;

public interface IJwtProvider
{
    string Generate(User user);
}