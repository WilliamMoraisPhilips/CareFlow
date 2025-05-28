package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;


@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        try {
            String resultado = loginService.fazerLogin(loginDTO);
            return ResponseEntity.ok(resultado);
        } catch (SQLException e) {
            return ResponseEntity.status(500).body("Erro no servidor: " + e.getMessage());
        }
    }
}

