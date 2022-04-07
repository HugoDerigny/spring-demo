package com.example.demo.service;

import com.example.demo.flag.Flag;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Path("services")
public class ServiceResource {
	@Autowired
	private ServiceRepository serviceRepository;

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Service createService(Service service) {
		return serviceRepository.save(service);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Service> getAllService() {
		List<Service> services = new ArrayList<>();
		serviceRepository.findAll().forEach(services::add);
		return services;
	}

	@PUT
	@Path("{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateService(@PathParam("id") String id, Service updatedServiceBody) {
		Optional<Service> service = serviceRepository.findById(id);

		if (service.isPresent()) {
			Service updatedService = service.get();
			updatedService.update(updatedServiceBody);

			serviceRepository.save(updatedService);

			return Response.ok(updatedService).build();
		}

		return Response.notModified().build();
	}

	@DELETE
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteService(@PathParam("id") String id) {
		if (serviceRepository.findById(id).isPresent()) {
			serviceRepository.deleteById(id);
		}
		return Response.noContent().build();
	}

	@GET
	@Path("{id}/flags")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Flag> getFlags(@PathParam("id") String serviceId) {
		return serviceRepository.findById(serviceId).get().getFlags();
	}
}
