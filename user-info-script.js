const addMemberBtn = document.getElementById('add-member-btn');
const membersContainer = document.getElementById('members-container');
const submitBtn = document.getElementById('submit-btn');
const template = document.getElementById('member-template').content;

let memberCount = 0;

// Add new member card
addMemberBtn.addEventListener('click', () => {
  const clone = document.importNode(template, true);
  clone.querySelector('h3').textContent = `Member ${memberCount + 1}`;

  // Remove member
  clone.querySelector('.remove-member-btn').addEventListener('click', (e) => {
    e.target.parentElement.remove();
  });

  membersContainer.appendChild(clone);
  memberCount++;
});

// Submit form
submitBtn.addEventListener('click', () => {
  const members = [];
  const cards = membersContainer.querySelectorAll('.member-card');

  cards.forEach(card => {
    const member = {
      name: card.querySelector('input[name="name"]').value,
      gender: card.querySelector('select[name="gender"]').value,
      age: card.querySelector('input[name="age"]').value,
      workout_time: card.querySelector('select[name="workout_time"]').value,
      medical: card.querySelector('input[name="medical"]').value
    };
    members.push(member);
  });

  console.log('Submitted Members:', members);

  // TODO: Send `members` array to backend API via fetch/axios
  alert('Members submitted! Check console for details.');
});
