#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define MAX_ACCOUNTS 100
#define PIN_MIN 1000
#define PIN_MAX 9999
#define ACCOUNT_MIN 10000000
#define ACCOUNT_MAX 99999999

struct BankAccount {
    char accountHolder[100];
    int accountNumber;
    int PIN;
    float balance;
};

int validAccountHolder(const char *name) {
    for (int i = 0; name[i] != '\0'; i++) {
        if (!isalpha(name[i]) && name[i] != ' ') {
            return 0;
        }
    }
    return 1;
}

int validAccountNumber(int accountNumber, struct BankAccount accounts[], int numAccounts) {
    if (accountNumber < ACCOUNT_MIN || accountNumber > ACCOUNT_MAX) {
        return 0;
    }
    
    for (int i = 0; i < numAccounts; i++) {
        if (accounts[i].accountNumber == accountNumber) {
            return 0;
        }
    }
    return 1;
}

void clearInputBuffer() {
    int userInput;
    while ((userInput = getchar()) != '\n' && userInput != EOF);
}

void createAccount(struct BankAccount accounts[], int *numAccounts) {
    const int MAX_NAME_LENGTH = 99;
    char tempName[MAX_NAME_LENGTH + 1];

    if (*numAccounts < MAX_ACCOUNTS) {
        do {
            printf("Enter Account Holder Name: ");
            clearInputBuffer();
            fgets(tempName, sizeof(tempName), stdin);
            tempName[strcspn(tempName, "\n")] = '\0';

            if (!validAccountHolder(tempName)) {
                printf("Invalid account holder name. Only alphabetic letters and spaces are allowed.\n");
            } else if (strlen(tempName) > MAX_NAME_LENGTH) {
                printf("Account holder name is too long. Please enter up to %d characters only.\n", MAX_NAME_LENGTH);
            }
        } while (!validAccountHolder(tempName) || (strlen(tempName) > MAX_NAME_LENGTH));

        strncpy(accounts[*numAccounts].accountHolder, tempName, MAX_NAME_LENGTH);
        accounts[*numAccounts].accountHolder[MAX_NAME_LENGTH] = '\0';

        int accountNumber;
        do {
            printf("Enter Account Number: ");
            if (scanf("%d", &accountNumber) != 1 || !validAccountNumber(accountNumber, accounts, *numAccounts)) {
                printf("Invalid account number or account already exists. Please try again.\n");
                clearInputBuffer();
                continue;
            }
            break;
        } while (1);
        
        accounts[*numAccounts].accountNumber = accountNumber;

        int PIN, confirmPIN;
        do {
            printf("Set a 4-digit PIN: ");
            if (scanf("%d", &PIN) != 1 || PIN < PIN_MIN || PIN > PIN_MAX) {
                printf("Invalid PIN. Please enter a valid 4-digit PIN.\n");
                clearInputBuffer();
                continue;
            }
            printf("Confirm 4-digit PIN: ");
            if (scanf("%d", &confirmPIN) != 1 || confirmPIN < PIN_MIN || confirmPIN > PIN_MAX) {
                printf("Invalid PIN. Please enter a valid 4-digit PIN.\n");
                clearInputBuffer();
                continue;
            }
            if (PIN != confirmPIN) {
                printf("PINs do not match. Please try again.\n");
                continue;
            }
            break;
        } while (1);

        accounts[*numAccounts].PIN = PIN;

        accounts[*numAccounts].balance = 0.0;
        (*numAccounts)++;
        printf("Account has been created. Feel free to make deposits or withdrawals, check balance, and etc.\n");
        return;
    }
    printf("Account limit reached. Unable to create any more accounts at this time.\n");
}

int verifyPIN(int accountNumber, struct BankAccount accounts[], int numAccounts) {
    for (int i = 0; i < numAccounts; i++) {
        if (accounts[i].accountNumber == accountNumber) {
            printf("Enter 4-digit pin: ");
            int PIN;
            if (scanf("%d", &PIN) != 1 || PIN < PIN_MIN || PIN > PIN_MAX) {
                printf("Invalid pin format. Access denied!\n");
            }
            if (accounts[i].PIN == PIN) {
                return i;
            }
            printf("Invalid pin. Access denied!\n");
            return -1;
        }
    }
    printf("Account not found.\n");
    return -1;
}

void depositAmount(struct BankAccount accounts[], int numAccounts) {
    int accountNumber;
    float amount;

    printf("Enter account number for deposit: ");
    scanf("%d", &accountNumber);

    int accountIndex = verifyPIN(accountNumber, accounts, numAccounts);
    if (accountIndex == -1) return;

    printf("Enter amount: ");
    scanf("%f", &amount);

    if (amount <= 0) {
        printf("Amount must be positive. Deposit failed.\n");
        return;
    }

    accounts[accountIndex].balance += amount;
    printf("Deposited $%.2f into account. New balance: $%.2f\n", amount, accounts[accountIndex].balance);
}

void withdrawAmount(struct BankAccount accounts[], int numAccounts) {
    int accountNumber;
    float amount;

    printf("Enter account number for withdrawal: ");
    scanf("%d", &accountNumber);
    
    int accountIndex = verifyPIN(accountNumber, accounts, numAccounts);
    if (accountIndex == -1) return;

    printf("Enter amount: ");
    scanf("%f", &amount);

    if (amount <= 0) {
        printf("Amount must be positive. Withdrawal failed.\n");
        return;
    }
    if (amount > accounts[accountIndex].balance) {
        printf("Insufficient funds. Withdrawal failed.\n");
        return;
    }

    accounts[accountIndex].balance -= amount;
    printf("Withdrew $%.2f from account. New balance: $%.2f", amount, accounts[accountIndex].balance);
}

void checkBalance(struct BankAccount accounts[], int numAccounts) {
    int accountNumber;

    printf("Enter account number to check balance: ");
    scanf("%d", &accountNumber);

    int accountIndex = verifyPIN(accountNumber, accounts, numAccounts);
    if (accountIndex == -1) return;

    printf("Account Holder Name: %s\nAccount Number: %d\nBalance: %.2f\n", accounts[accountIndex].accountHolder, accountNumber, accounts[accountIndex].balance);
}

int confirmAction(const char *action) {
    char confirmation[4];
    clearInputBuffer();
    printf("Are you sure you want to %s? (yes/no): ", action);
    fgets(confirmation, sizeof(confirmation), stdin);
    confirmation[strcspn(confirmation, "\n")] = '\0';

    for (int i = 0; confirmation[i]; i++) {
        confirmation[i] = tolower(confirmation[i]);
    }
    
    if (strcmp(confirmation, "yes") == 0 || strcmp(confirmation, "y") == 0) {
        return 1;
    }
    return 0;
}

void changePIN(struct BankAccount accounts[], int numAccounts) {
    int accountNumber;
    
    printf("Enter account number to change PIN: ");
    scanf("%d", &accountNumber);
    
    int accountIndex = verifyPIN(accountNumber, accounts, numAccounts);
    if (accountIndex == -1) return;

    if (!confirmAction("change the PIN")) {
        printf("PIN change canceled.\n");
        return;
    }

    int newPIN, confirmPIN;
    do {
        printf("Enter new 4-digit pin: ");
        if (scanf("%d", &newPIN) != 1 || newPIN < PIN_MIN || newPIN > PIN_MAX) {
            printf("Invalid pin. Please enter a valid 4-digit pin.\n");
            clearInputBuffer();
            continue;
        }

        printf("Confirm new 4-digit pin: ");
        if (scanf("%d", &confirmPIN) != 1 || confirmPIN < PIN_MIN || confirmPIN > PIN_MAX) {
            printf("Invalid pin. Please enter a valid 4-digit pin.\n");
            clearInputBuffer();
            continue;
        }

        if (newPIN != confirmPIN) {
            printf("PINSs do not match. Pleae try again.\n");
            continue;
        }
        
        break;
    } while (1);

    accounts[accountIndex].PIN = newPIN;
    printf("PIN successfully changed.\n");
}

void deleteAccount(struct BankAccount accounts[], int *numAccounts) {
    int accountNumber;

    printf("Enter account number for deletion: ");
    scanf("%d", &accountNumber);

    int accountIndex = verifyPIN(accountNumber, accounts, *numAccounts);
    if (accountIndex == -1) return;

    if (!confirmAction("delete this account")) {
        printf("Account deletion canceled.\n");
        return;
    }

    for (int j = accountIndex; j < *numAccounts - 1; j++) {
        accounts[j] = accounts[j + 1];
    }
    (*numAccounts)--;
    printf("Account has been removed.\n");
}

int main() {
    struct BankAccount accounts[MAX_ACCOUNTS];
    int choice;
    int numAccounts = 0;

    do {
        printf("\nThe Bank\n");
        printf("1.) Create Account\n");
        printf("2.) Make Deposit\n");
        printf("3.) Make Withdrawal\n");
        printf("4.) Check Balance\n");
        printf("5.) Change PIN\n");
        printf("6.) Delete Account\n");
        printf("7.) Leave Bank\n");
        printf("Select Option: ");
        while (scanf("%d", &choice) != 1) {
            printf("invalid choice. Please enter a valid option.\n");
            clearInputBuffer();
        }

        switch (choice) {
            case 1:
                createAccount(accounts, &numAccounts);
                break;
            case 2:
                depositAmount(accounts, numAccounts);
                break;
            case 3:
                withdrawAmount(accounts, numAccounts);
                break;
            case 4:
                checkBalance(accounts, numAccounts);
                break;
            case 5:
                changePIN(accounts, numAccounts);
                break;
            case 6:
                deleteAccount(accounts, &numAccounts);
                break;
            case 7:
                printf("Now leaving the bank. Thank you for your service.\n");
                break;
            default:
                printf("Invalid choice. Please enter a valid option.\n");
        }
    } while (choice != 7);
    return 0;
}