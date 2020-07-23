function getCompanies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve([{ xxx: 'yyy' }]), 500);
  });
}

export default getCompanies;
