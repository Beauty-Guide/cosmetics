package ru.cosmetic.server.service;

import ru.cosmetic.server.models.Role;
import ru.cosmetic.server.repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public Role getUserRole() {
        return roleRepository.findById(1L).orElse(null);
    }

    public Role getAdminRole() {
        return roleRepository.findById(2L).orElse(null);
    }
}
