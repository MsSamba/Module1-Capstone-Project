const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.addEventListener('input', calculateCompoundInterest));

        function calculateCompoundInterest() {
            // Get input values
            const P = parseFloat(document.getElementById('principal').value);
            const r = parseFloat(document.getElementById('rate').value) / 100;
            const t = parseFloat(document.getElementById('years').value);
            const n = parseFloat(document.getElementById('compounds').value);
            const monthlyTopUp = parseFloat(document.getElementById('monthlyTopUp').value);

            // Validation
            if ([P, r, t, n, monthlyTopUp].some(isNaN) || P <= 0 || r <= 0 || t <= 0 || n < 1 || monthlyTopUp < 0) {
                document.getElementById('result').innerHTML = 
                    '<p class="error">Please fill all fields with valid positive numbers</p>';
                return;
            }

            // Calculate compound interest with monthly top-ups
            const totalMonths = t * 12;
            const monthsPerPeriod = 12 / n;
            let currentPeriodMonths = 0;
            let total = P;
            let totalTopUps = 0;

            for (let month = 1; month <= totalMonths; month++) {
                total += monthlyTopUp;
                totalTopUps += monthlyTopUp;

                currentPeriodMonths++;

                if (currentPeriodMonths === monthsPerPeriod) {
                    const interest = total * (r / n);
                    total += interest;
                    currentPeriodMonths = 0;
                }
            }

            // Handle any remaining partial period interest
            if (currentPeriodMonths > 0) {
                const fraction = currentPeriodMonths / monthsPerPeriod;
                const interest = total * (r / n) * fraction;
                total += interest;
            }

            // Calculate interest earned minus top-ups
            const interestEarned = total - P - totalTopUps;

            // Format results
            const formatter = new Intl.NumberFormat('en-UK', {
                style: 'currency',
                currency: 'KES'
            });

            // Display results
            document.getElementById('result').innerHTML = `
                <strong>Total Amount:</strong> ${formatter.format(total)}<br>
                <strong>Principal:</strong> ${formatter.format(P)}<br>
                <strong>Interest Earned (minus top-ups):</strong> ${formatter.format(interestEarned)}<br>
                <strong>Total Top-ups:</strong> ${formatter.format(totalTopUps)}<br>
                <strong>Annual Growth Rate:</strong> ${(r * 100).toFixed(2)}%<br>
                <strong>Compounding Frequency:</strong> ${n}x/year
            `;
        }