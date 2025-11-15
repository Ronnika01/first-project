 document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('bookingForm');
            const successMsg = document.getElementById('successMsg');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    service: document.getElementById('service').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    guests: document.getElementById('guests').value,
                    notes: document.getElementById('notes').value.trim()
                };

                // Validate
                if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
                    alert('Please fill out all required fields.');
                    return;
                }
                 // Disable submit
                const submitBtn = form.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Booking...';

                // Simulate sending (in real app, POST to backend)
                await new Promise(r => setTimeout(r, 1200));

                // Reset form & show success
                form.reset();
                successMsg.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Book Appointment';

                // Hide success message after 4 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 4000);
            });

            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').setAttribute('min', today);
        });