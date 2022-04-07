package com.example.demo.flag;

import com.example.demo.service.Service;
import com.example.demo.service.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Path("flags")
public class FlagResource {
	@Autowired
	private FlagRepository flagRepository;
	@Autowired
	private ServiceRepository serviceRepository;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Flag> getFlags() {
		List<Flag> flags = new ArrayList<>();
		flagRepository.findAll().forEach(flags::add);
		return flags;
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFlag(FlagDto flagDto) {
		Optional<Service> associatedService = serviceRepository.findById(flagDto.serviceId);

		if (associatedService.isEmpty()) {
			return Response.status(400, "Unknown service.").build();
		}

		Service service = associatedService.get();
		Flag flag = Flag.FromDto(flagDto);

		service.addFlag(flag);

		flagRepository.save(flag);
		serviceRepository.save(service);

		return Response.ok(flag).status(201).build();
	}

	@PUT
	@Path("{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateFlag(@PathParam("id") Long id, Flag updatedFlagBody) {
		Optional<Flag> flag = flagRepository.findById(id);

		if (flag.isPresent()) {
			Flag updatedFlag = flag.get();
			updatedFlag.update(updatedFlagBody);
			flagRepository.save(updatedFlag);

			return Response.ok(updatedFlag).build();
		}

		return Response.notModified().build();
	}

	@DELETE
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteFlag(@PathParam("id") Long id) {
		System.out.println(id);
		if (flagRepository.findById(id).isPresent()) {
			try {
				flagRepository.deleteById(id);
			} catch (Exception e) {
				System.err.println(e);
				return Response.serverError().build();
			}
		}
		return Response.noContent().build();
	}
}
