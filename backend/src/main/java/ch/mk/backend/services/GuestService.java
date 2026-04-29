package ch.mk.backend.services;

import ch.mk.backend.entities.Guest;
import ch.mk.backend.repositories.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GuestService {
    @Autowired
    private GuestRepository guestRepository;

    public Guest createGuest(String email) {
        Guest guest = new Guest();
        guest.setEmail(email);

        guestRepository.save(guest);
        return guest;
    }
}
