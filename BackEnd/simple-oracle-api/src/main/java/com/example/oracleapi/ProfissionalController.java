package com.example.oracleapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://127.0.0.1:5500")

@RestController
@RequestMapping("/api")
public class ProfissionalController {

	@Autowired
	private ProfissionalService service;

	public ProfissionalController(ProfissionalService service) {
		this.service = service;
	}

	@PutMapping("/profissionais/{id}")
	public void atualizarProfissional(@PathVariable Integer id, @RequestBody ProfissionalDTO profissionalDTO)
			throws SQLException {
		service.atualizarProfissional(id, profissionalDTO);
	}

	@PostMapping("/profissionais")
	public void inserirProfissional(@RequestBody ProfissionalDTO profissionalDTO) throws SQLException {
		// Convert especializacao from a comma-separated string to a List (if necessary)
		if (profissionalDTO.getEspecializacao() != null && profissionalDTO.getEspecializacao().size() == 1) {
			profissionalDTO.setEspecializacao(Arrays.asList(profissionalDTO.getEspecializacao().get(0).split(",")));
		}

		// Ensure termino is set to null if empty
		if (profissionalDTO.getContrato().getTermino() == null) {
			profissionalDTO.getContrato().setTermino(null);
		}

		// Call the service function
		service.inserirProfissional(profissionalDTO);
	}

	@GetMapping("/profissionais")
	public List<Map<String, Object>> getProfissionais() throws SQLException {
		return service.obterProfissionais();
	}

	@GetMapping("/profissionais/nome/{nome}")
	public List<Map<String, Object>> getProfissionaisPorNome(@PathVariable String nome) throws SQLException {
		return service.obterProfissionaisNome(nome);
	}

	@GetMapping("/setor")
	public List<Map<String, Object>> getSetores() throws SQLException {
		return service.obterSetores();
	}

	@GetMapping("/bairro")
	public List<Map<String, Object>> getBairros() throws SQLException {
		return service.obterBairros();
	}

	@GetMapping("/contrato")
	public List<Map<String, Object>> getContratos() throws SQLException {
		return service.obterContratos();
	}

	@GetMapping("/especializacao")
	public List<Map<String, Object>> getEspecializacoes() throws SQLException {
		return service.obterEspecializacoes();
	}

	@GetMapping("/niveldeacesso")
	public List<Map<String, Object>> getNiveisDeAcesso() throws SQLException {
		return service.obterNiveisDeAcesso();
	}

	@GetMapping("/formacao")
	public List<Map<String, Object>> getFormacao() throws SQLException {
		return service.obterFormacao();
	}

	@GetMapping("/jornada")
	public List<Map<String, Object>> getJornadas() throws SQLException {
		return service.obterJornadas();
	}

	@GetMapping("/cargo")
	public List<Map<String, Object>> getCargos() throws SQLException {
		return service.obterCargos();
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500")
	@DeleteMapping("/profissionais/{id:[0-9]+}")
	public ResponseEntity<Void> delProfissionalPorId(@PathVariable int id) throws SQLException {
		boolean deleted = service.removerProfissionalPorId(id);
		if (deleted) {
			return ResponseEntity.noContent().build(); // 204 No Content for successful deletion
		} else {
			return ResponseEntity.notFound().build(); // 404 Not Found if the ID doesn't exist
		}
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500")
	@GetMapping("/setores/{setor:[0-9]+}")
	public List<Map<String, Object>> getProfissionaisPorSetor(@PathVariable String setor) throws SQLException {
		return service.obterProfissionaisSetor(setor);
	}

	@CrossOrigin(origins = "http://127.0.0.1:5500")
	@GetMapping("/cargos/{cargo:[0-9]+}")
	public List<Map<String, Object>> getProfissionaisPorCargo(@PathVariable String cargo) throws SQLException {
		return service.obterProfissionaisCargo(cargo);
	}

}